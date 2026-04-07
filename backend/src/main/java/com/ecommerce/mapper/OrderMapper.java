package com.ecommerce.mapper;

import com.ecommerce.dto.OrderItemResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.dto.PaymentVerificationResponse;
import com.ecommerce.entity.CustomerOrder;
import com.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponse toResponse(CustomerOrder order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(this::toItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getPhone(),
                order.getAddress(),
                order.getPincode(),
                order.getTotalAmount(),
                order.getPaymentStatus().name(),
                order.getRazorpayOrderId(),
                order.getRazorpayPaymentId(),
                isDemoOrder(order),
                order.getCreatedAt(),
                items
        );
    }

    public PaymentVerificationResponse toPaymentVerificationResponse(CustomerOrder order) {
        return new PaymentVerificationResponse(
                order.getId(),
                order.getPaymentStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                isDemoOrder(order)
        );
    }

    private boolean isDemoOrder(CustomerOrder order) {
        return order.getRazorpayOrderId() != null && order.getRazorpayOrderId().startsWith("demo_order_");
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getPrice()
        );
    }
}
