package com.ecommerce.dto;

public record ProductMediaResponse(
        Long id,
        String url,
        String type,
        Integer position
) {
}
