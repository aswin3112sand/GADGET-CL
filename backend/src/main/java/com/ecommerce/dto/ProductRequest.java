package com.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Size(max = 160) String brand,
        @NotBlank @Size(max = 600) String description,
        @NotBlank String fullDescription,
        @NotNull @DecimalMin(value = "0.01", message = "Price must be greater than zero") BigDecimal price,
        @NotNull @Min(value = 0, message = "Discount cannot be negative") @Max(value = 95, message = "Discount must stay below 95%") Integer discountPercentage,
        @NotNull @Min(value = 0, message = "Stock quantity cannot be negative") Integer stockQuantity,
        @NotNull Long sectionId,
        @Size(max = 120) String sku,
        @NotNull Boolean lowStockAlertEnabled,
        List<@Valid ProductMediaRequest> mediaList,
        List<@Size(max = 1024) String> imageUrls,
        @Size(max = 1024) String imageUrl,
        @Size(max = 1024) String videoUrl
) {
}
