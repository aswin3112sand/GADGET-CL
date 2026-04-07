package com.ecommerce.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CheckoutSnapshot(
        String razorpayOrderId,
        String paymentMode,
        String customerName,
        String phone,
        String address,
        String pincode,
        BigDecimal totalAmount,
        List<CheckoutSnapshotItem> items
) {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public static List<CheckoutSnapshotItem> itemListFrom(Object source) {
        if (source == null) {
            return Collections.emptyList();
        }
        return OBJECT_MAPPER.convertValue(source, new TypeReference<>() {
        });
    }
}
