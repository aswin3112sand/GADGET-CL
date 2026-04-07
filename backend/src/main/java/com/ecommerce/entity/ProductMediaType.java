package com.ecommerce.entity;

import java.util.Locale;

public enum ProductMediaType {
    IMAGE,
    VIDEO;

    public static ProductMediaType fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Media type is required");
        }

        return ProductMediaType.valueOf(value.trim().toUpperCase(Locale.ENGLISH));
    }

    public String apiValue() {
        return name().toLowerCase(Locale.ENGLISH);
    }
}
