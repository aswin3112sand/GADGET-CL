package com.ecommerce.security;

import com.ecommerce.config.JwtProperties;
import com.ecommerce.entity.Admin;
import com.ecommerce.service.CheckoutSnapshot;
import com.ecommerce.service.CheckoutSnapshotItem;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
            new JwtProperties(
                    "this-is-a-very-long-test-secret-that-is-not-base64-encoded",
                    60,
                    30,
                    "test-suite"
            )
    );

    @Test
    void shouldRoundTripCheckoutToken() {
        CheckoutSnapshot snapshot = new CheckoutSnapshot(
                "order_123",
                "LIVE",
                "Riya Sharma",
                "9876543210",
                "123 Test Street",
                "560001",
                new BigDecimal("199.99"),
                List.of(new CheckoutSnapshotItem(1L, "Premium Phone", new BigDecimal("199.99"), 1))
        );

        String token = jwtService.generateCheckoutToken(snapshot);
        CheckoutSnapshot parsed = jwtService.parseCheckoutToken(token);

        assertEquals(snapshot.razorpayOrderId(), parsed.razorpayOrderId());
        assertEquals(snapshot.paymentMode(), parsed.paymentMode());
        assertEquals(snapshot.customerName(), parsed.customerName());
        assertEquals(snapshot.phone(), parsed.phone());
        assertEquals(snapshot.totalAmount(), parsed.totalAmount());
        assertEquals(1, parsed.items().size());
        assertEquals("Premium Phone", parsed.items().get(0).productName());
    }

    @Test
    void shouldValidateAdminToken() {
        Admin admin = Admin.builder()
                .id(7L)
                .email("admin@example.com")
                .password("hashed-password")
                .build();

        String token = jwtService.generateAdminToken(admin);
        var userDetails = User.withUsername("admin@example.com")
                .password("hashed-password")
                .authorities("ROLE_ADMIN")
                .build();

        assertTrue(jwtService.isAdminTokenValid(token, userDetails));
        assertEquals("admin@example.com", jwtService.extractAdminUsername(token));
    }
}
