package com.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String customerName,
        String phone,
        String address,
        String pincode,
        BigDecimal totalAmount,
        String paymentStatus,
        String razorpayOrderId,
        String razorpayPaymentId,
        boolean demoMode,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
