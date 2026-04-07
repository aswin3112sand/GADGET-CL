package com.ecommerce.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RazorpayOrderResult(
        String id,
        Long amount,
        String currency,
        String receipt,
        String status
) {
}
