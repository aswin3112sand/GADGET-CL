package com.ecommerce.dto;

public record SectionResponse(
        Long id,
        String name,
        long productCount
) {
}
