package com.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian mobile number") String phone,
        @NotBlank String address,
        @NotBlank @Pattern(regexp = "^\\d{6}$", message = "Pincode must be a valid 6-digit code") String pincode,
        @NotEmpty List<@Valid CartItemRequest> items
) {
}
