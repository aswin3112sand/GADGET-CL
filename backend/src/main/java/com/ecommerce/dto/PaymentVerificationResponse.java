package com.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentVerificationResponse(
        Long orderId,
        String paymentStatus,
        BigDecimal totalAmount,
        LocalDateTime createdAt,
        boolean demoMode
) {
}
