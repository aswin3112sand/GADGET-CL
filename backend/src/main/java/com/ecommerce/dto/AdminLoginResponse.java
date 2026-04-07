package com.ecommerce.dto;

public record AdminLoginResponse(
        String token,
        String tokenType,
        long expiresIn,
        AdminSummaryResponse admin
) {
}
