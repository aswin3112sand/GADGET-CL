package com.ecommerce.dto;

public record CreateOrderResponse(
        String razorpayOrderId,
        Long amount,
        String currency,
        String keyId,
        String checkoutToken,
        boolean demoMode
) {
}
