package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminChangePasswordRequest(
        @NotBlank String currentPassword,
        @NotBlank
        @Size(min = 8, message = "must be at least 8 characters long")
        String newPassword
) {
}
