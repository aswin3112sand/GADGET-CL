package com.ecommerce.service;

import com.ecommerce.config.RazorpayProperties;
import com.ecommerce.config.DemoProperties;
import com.ecommerce.dto.*;
import com.ecommerce.entity.CustomerOrder;
import com.ecommerce.entity.PaymentStatus;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RazorpayGatewayService razorpayGatewayService;

    @Mock
    private JwtService jwtService;

    @Mock
    private OrderMapper orderMapper;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        RazorpayProperties razorpayProperties = new RazorpayProperties(
                "rzp_test_key",
                "rzp_test_secret",
                "https://api.razorpay.com/v1",
                "INR"
        );
        orderService = new OrderService(
                productRepository,
                orderRepository,
                razorpayGatewayService,
                razorpayProperties,
                new DemoProperties(false, "image", "video"),
                jwtService,
                orderMapper
        );
    }

    @Test
    void createOrderShouldCalculateAmountFromDatabasePrices() {
        Product phone = Product.builder().id(1L).name("Phone").price(new BigDecimal("100.00")).stockQuantity(10).build();
        Product buds = Product.builder().id(2L).name("Buds").price(new BigDecimal("50.50")).stockQuantity(10).build();
        when(productRepository.findAllById(anyList())).thenReturn(List.of(phone, buds));
        when(razorpayGatewayService.createOrder(anyLong(), anyString(), anyMap()))
                .thenReturn(new RazorpayOrderResult("order_123", 35050L, "INR", "receipt_123", "created"));
        when(jwtService.generateCheckoutToken(any())).thenReturn("checkout-token");

        CreateOrderRequest request = new CreateOrderRequest(
                "Riya Sharma",
                "9876543210",
                "123 Test Street",
                "560001",
                List.of(
                        new CartItemRequest(1L, 1),
                        new CartItemRequest(1L, 2),
                        new CartItemRequest(2L, 1)
                )
        );

        CreateOrderResponse response = orderService.createOrder(request);

        assertEquals("order_123", response.razorpayOrderId());
        assertEquals(35050L, response.amount());
        assertEquals("INR", response.currency());
        assertEquals("rzp_test_key", response.keyId());
        assertEquals("checkout-token", response.checkoutToken());
        assertEquals(false, response.demoMode());
        verify(razorpayGatewayService).createOrder(eq(35050L), anyString(), anyMap());

        ArgumentCaptor<CheckoutSnapshot> snapshotCaptor = ArgumentCaptor.forClass(CheckoutSnapshot.class);
        verify(jwtService).generateCheckoutToken(snapshotCaptor.capture());
        CheckoutSnapshot snapshot = snapshotCaptor.getValue();
        assertEquals(new BigDecimal("350.50"), snapshot.totalAmount());
        assertEquals(2, snapshot.items().size());
        assertEquals(3, snapshot.items().get(0).quantity());
        assertEquals("LIVE", snapshot.paymentMode());
    }

    @Test
    void verifyPaymentShouldReturnExistingOrderForSamePaymentId() {
        CustomerOrder existingOrder = CustomerOrder.builder()
                .id(12L)
                .paymentStatus(PaymentStatus.PAID)
                .totalAmount(new BigDecimal("499.00"))
                .createdAt(LocalDateTime.now())
                .build();
        PaymentVerificationResponse expectedResponse = new PaymentVerificationResponse(
                12L,
                "PAID",
                new BigDecimal("499.00"),
                existingOrder.getCreatedAt(),
                false
        );

        when(orderRepository.findByRazorpayPaymentId("pay_123")).thenReturn(Optional.of(existingOrder));
        when(orderMapper.toPaymentVerificationResponse(existingOrder)).thenReturn(expectedResponse);

        VerifyPaymentRequest request = new VerifyPaymentRequest("order_123", "pay_123", "signature", "token");
        PaymentVerificationResponse actual = orderService.verifyPayment(request);

        assertSame(expectedResponse, actual);
        verifyNoInteractions(razorpayGatewayService, jwtService, productRepository);
    }

    @Test
    void createOrderShouldUseDemoModeWhenGatewayIsUnavailableAndDemoIsEnabled() {
        RazorpayProperties razorpayProperties = new RazorpayProperties(
                "rzp_test_key",
                "rzp_test_secret",
                "https://api.razorpay.com/v1",
                "INR"
        );
        OrderService demoOrderService = new OrderService(
                productRepository,
                orderRepository,
                razorpayGatewayService,
                razorpayProperties,
                new DemoProperties(true, "image", "video"),
                jwtService,
                orderMapper
        );

        Product product = Product.builder()
                .id(1L)
                .name("Phone")
                .price(new BigDecimal("199.00"))
                .stockQuantity(4)
                .build();

        when(productRepository.findAllById(anyList())).thenReturn(List.of(product));
        when(razorpayGatewayService.isConfigured()).thenReturn(false);
        when(jwtService.generateCheckoutToken(any())).thenReturn("demo-token");

        CreateOrderResponse response = demoOrderService.createOrder(new CreateOrderRequest(
                "Riya Sharma",
                "9876543210",
                "123 Test Street",
                "560001",
                List.of(new CartItemRequest(1L, 2))
        ));

        assertTrue(response.demoMode());
        assertTrue(response.razorpayOrderId().startsWith("demo_order_"));
        assertEquals(39800L, response.amount());
        assertEquals("demo-token", response.checkoutToken());
        verify(razorpayGatewayService, never()).createOrder(anyLong(), anyString(), anyMap());
    }

    @Test
    void verifyPaymentShouldDecrementStockForDemoOrder() {
        RazorpayProperties razorpayProperties = new RazorpayProperties(
                "rzp_test_key",
                "rzp_test_secret",
                "https://api.razorpay.com/v1",
                "INR"
        );
        OrderService demoOrderService = new OrderService(
                productRepository,
                orderRepository,
                razorpayGatewayService,
                razorpayProperties,
                new DemoProperties(true, "image", "video"),
                jwtService,
                orderMapper
        );

        Product product = Product.builder()
                .id(1L)
                .name("Phone")
                .price(new BigDecimal("299.00"))
                .stockQuantity(6)
                .build();

        String demoOrderId = "demo_order_" + UUID.randomUUID().toString().replace("-", "");
        CheckoutSnapshot snapshot = new CheckoutSnapshot(
                demoOrderId,
                "DEMO",
                "Riya Sharma",
                "9876543210",
                "123 Test Street",
                "560001",
                new BigDecimal("598.00"),
                List.of(new CheckoutSnapshotItem(1L, "Phone", new BigDecimal("299.00"), 2))
        );

        PaymentVerificationResponse expectedResponse = new PaymentVerificationResponse(
                88L,
                "PAID",
                new BigDecimal("598.00"),
                LocalDateTime.now(),
                true
        );

        when(orderRepository.findByRazorpayPaymentId("demo_pay_1234567890")).thenReturn(Optional.empty());
        when(jwtService.parseCheckoutToken("demo-token")).thenReturn(snapshot);
        when(orderRepository.findByRazorpayOrderId(demoOrderId)).thenReturn(Optional.empty());
        when(productRepository.findAllByIdInForUpdate(anyList())).thenReturn(List.of(product));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer((invocation) -> {
            CustomerOrder order = invocation.getArgument(0);
            order.setId(88L);
            order.setCreatedAt(expectedResponse.createdAt());
            return order;
        });
        when(orderMapper.toPaymentVerificationResponse(any(CustomerOrder.class))).thenReturn(expectedResponse);

        PaymentVerificationResponse actual = demoOrderService.verifyPayment(new VerifyPaymentRequest(
                demoOrderId,
                "demo_pay_1234567890",
                "demo-signature",
                "demo-token"
        ));

        assertSame(expectedResponse, actual);
        assertEquals(4, product.getStockQuantity());
        verify(razorpayGatewayService, never()).verifySignature(anyString(), anyString(), anyString());
    }

    @Test
    void createOrderShouldRejectWhenStockIsInsufficient() {
        Product product = Product.builder()
                .id(1L)
                .name("Phone")
                .price(new BigDecimal("199.00"))
                .stockQuantity(1)
                .build();

        when(productRepository.findAllById(anyList())).thenReturn(List.of(product));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> orderService.createOrder(
                new CreateOrderRequest(
                        "Riya Sharma",
                        "9876543210",
                        "123 Test Street",
                        "560001",
                        List.of(new CartItemRequest(1L, 2))
                )
        ));

        assertTrue(exception.getMessage().contains("Phone has only 1 unit(s) available right now."));
        verifyNoInteractions(razorpayGatewayService, jwtService);
    }
}
