package com.ecommerce.dto;

public record UploadResponse(
        String url,
        String secureUrl,
        String type,
        String mediaType,
        boolean demoMode,
        String note
) {
}
