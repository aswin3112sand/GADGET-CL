package com.ecommerce.service;

import com.ecommerce.config.DemoProperties;
import com.ecommerce.config.RazorpayProperties;
import com.ecommerce.dto.*;
import com.ecommerce.entity.CustomerOrder;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.PaymentStatus;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final String PAYMENT_MODE_LIVE = "LIVE";
    private static final String PAYMENT_MODE_DEMO = "DEMO";
    private static final String DEMO_ORDER_PREFIX = "demo_order_";
    private static final String DEMO_PAYMENT_PREFIX = "demo_pay_";
    private static final String DEMO_SIGNATURE = "demo-signature";

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final RazorpayGatewayService razorpayGatewayService;
    private final RazorpayProperties razorpayProperties;
    private final DemoProperties demoProperties;
    private final JwtService jwtService;
    private final OrderMapper orderMapper;

    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        List<CartItemRequest> normalizedItems = normalizeCartItems(request.items());
        Map<Long, Product> productMap = loadProducts(normalizedItems);
        validateStock(normalizedItems, productMap);

        List<CheckoutSnapshotItem> snapshotItems = normalizedItems.stream()
                .map(item -> {
                    Product product = productMap.get(item.productId());
                    return new CheckoutSnapshotItem(
                            product.getId(),
                            product.getName(),
                            product.getPrice(),
                            item.quantity()
                    );
                })
                .toList();

        BigDecimal totalAmount = snapshotItems.stream()
                .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long amountInPaise = toPaise(totalAmount);
        boolean demoMode = shouldUseDemoPayment();
        RazorpayOrderResult gatewayOrder = demoMode
                ? createDemoOrder(amountInPaise)
                : razorpayGatewayService.createOrder(
                        amountInPaise,
                        "receipt_" + UUID.randomUUID(),
                        Map.of("customerName", request.customerName(), "phone", request.phone())
                );

        CheckoutSnapshot snapshot = new CheckoutSnapshot(
                gatewayOrder.id(),
                demoMode ? PAYMENT_MODE_DEMO : PAYMENT_MODE_LIVE,
                request.customerName().trim(),
                request.phone().trim(),
                request.address().trim(),
                request.pincode().trim(),
                totalAmount,
                snapshotItems
        );

        return new CreateOrderResponse(
                gatewayOrder.id(),
                gatewayOrder.amount(),
                gatewayOrder.currency(),
                razorpayProperties.keyId(),
                jwtService.generateCheckoutToken(snapshot),
                demoMode
        );
    }

    @Transactional
    public PaymentVerificationResponse verifyPayment(VerifyPaymentRequest request) {
        Optional<CustomerOrder> existing = orderRepository.findByRazorpayPaymentId(request.razorpayPaymentId());
        if (existing.isPresent()) {
            return orderMapper.toPaymentVerificationResponse(existing.get());
        }

        CheckoutSnapshot snapshot = jwtService.parseCheckoutToken(request.checkoutToken());
        if (!request.razorpayOrderId().equals(snapshot.razorpayOrderId())) {
            throw new BadRequestException("Checkout token does not match Razorpay order");
        }

        if (PAYMENT_MODE_DEMO.equals(snapshot.paymentMode())) {
            validateDemoVerification(request);
        } else {
            razorpayGatewayService.verifySignature(
                    request.razorpayOrderId(),
                    request.razorpayPaymentId(),
                    request.razorpaySignature()
            );
        }

        if (orderRepository.findByRazorpayOrderId(request.razorpayOrderId()).isPresent()) {
            throw new BadRequestException("Razorpay order has already been processed");
        }

        List<CartItemRequest> snapshotItems = snapshot.items().stream()
                .map(item -> new CartItemRequest(item.productId(), item.quantity()))
                .toList();
        Map<Long, Product> productMap = loadProductsForUpdate(snapshotItems);
        validateStock(snapshotItems, productMap);

        CustomerOrder order = CustomerOrder.builder()
                .customerName(snapshot.customerName())
                .phone(snapshot.phone())
                .address(snapshot.address())
                .pincode(snapshot.pincode())
                .totalAmount(snapshot.totalAmount())
                .paymentStatus(PaymentStatus.PAID)
                .razorpayOrderId(request.razorpayOrderId())
                .razorpayPaymentId(request.razorpayPaymentId())
                .build();

        snapshot.items().forEach(item -> {
            Product product = productMap.get(item.productId());
            product.setStockQuantity(product.getStockQuantity() - item.quantity());
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(item.quantity())
                    .price(item.price())
                    .build();
            order.addItem(orderItem);
        });

        CustomerOrder savedOrder = orderRepository.save(order);
        return orderMapper.toPaymentVerificationResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    private List<CartItemRequest> normalizeCartItems(List<CartItemRequest> items) {
        Map<Long, Integer> quantitiesByProductId = new LinkedHashMap<>();
        for (CartItemRequest item : items) {
            quantitiesByProductId.merge(item.productId(), item.quantity(), Integer::sum);
        }
        return quantitiesByProductId.entrySet()
                .stream()
                .map(entry -> new CartItemRequest(entry.getKey(), entry.getValue()))
                .toList();
    }

    private Map<Long, Product> loadProducts(List<CartItemRequest> items) {
        List<Long> ids = items.stream().map(CartItemRequest::productId).distinct().toList();
        List<Product> products = productRepository.findAllById(ids);
        if (products.size() != ids.size()) {
            Set<Long> foundIds = products.stream().map(Product::getId).collect(Collectors.toSet());
            List<Long> missingIds = ids.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new BadRequestException("Some cart products do not exist: " + missingIds);
        }
        return products.stream().collect(Collectors.toMap(Product::getId, Function.identity()));
    }

    private Map<Long, Product> loadProductsForUpdate(List<CartItemRequest> items) {
        List<Long> ids = items.stream().map(CartItemRequest::productId).distinct().toList();
        List<Product> products = productRepository.findAllByIdInForUpdate(ids);
        if (products.size() != ids.size()) {
            Set<Long> foundIds = products.stream().map(Product::getId).collect(Collectors.toSet());
            List<Long> missingIds = ids.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new BadRequestException("Some cart products do not exist: " + missingIds);
        }
        return products.stream().collect(Collectors.toMap(Product::getId, Function.identity()));
    }

    private void validateStock(List<CartItemRequest> items, Map<Long, Product> productMap) {
        for (CartItemRequest item : items) {
            Product product = productMap.get(item.productId());
            if (product.getStockQuantity() == null || product.getStockQuantity() < item.quantity()) {
                throw new BadRequestException(product.getName() + " has only " + Math.max(product.getStockQuantity() == null ? 0 : product.getStockQuantity(), 0) + " unit(s) available right now.");
            }
        }
    }

    private boolean shouldUseDemoPayment() {
        return demoProperties.enabled() && !razorpayGatewayService.isConfigured();
    }

    private RazorpayOrderResult createDemoOrder(long amountInPaise) {
        String orderId = DEMO_ORDER_PREFIX + UUID.randomUUID().toString().replace("-", "");
        return new RazorpayOrderResult(orderId, amountInPaise, razorpayProperties.currency(), "demo_receipt", "created");
    }

    private void validateDemoVerification(VerifyPaymentRequest request) {
        if (!demoProperties.enabled()) {
            throw new BadRequestException("Demo checkout is not enabled.");
        }
        if (!request.razorpayOrderId().startsWith(DEMO_ORDER_PREFIX)
                || !request.razorpayPaymentId().startsWith(DEMO_PAYMENT_PREFIX)
                || !DEMO_SIGNATURE.equals(request.razorpaySignature())) {
            throw new BadRequestException("Invalid demo payment confirmation.");
        }
    }

    private long toPaise(BigDecimal amount) {
        return amount
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }
}
