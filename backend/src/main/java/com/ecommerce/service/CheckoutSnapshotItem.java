package com.ecommerce.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CheckoutSnapshotItem(
        Long productId,
        String productName,
        BigDecimal price,
        Integer quantity
) {
}
