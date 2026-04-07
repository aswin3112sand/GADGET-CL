package com.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        String description,
        String fullDescription,
        BigDecimal price,
        Integer discountPercentage,
        Integer stockQuantity,
        String sku,
        Boolean lowStockAlertEnabled,
        Long sectionId,
        String sectionName,
        String imageUrl,
        List<String> imageUrls,
        String videoUrl,
        List<ProductMediaResponse> mediaList,
        LocalDateTime createdAt
) {
}
