package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductMediaRequest(
        @NotBlank @Size(max = 1024) String url,
        @NotBlank @Pattern(regexp = "(?i)image|video", message = "Media type must be image or video") String type
) {
}
