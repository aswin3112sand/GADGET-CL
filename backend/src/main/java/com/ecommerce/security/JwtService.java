package com.ecommerce.security;

import com.ecommerce.config.JwtProperties;
import com.ecommerce.entity.Admin;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.service.CheckoutSnapshot;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = buildKey(jwtProperties.secret());
    }

    public String generateAdminToken(Admin admin) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(jwtProperties.expirationMinutes(), ChronoUnit.MINUTES);
        return Jwts.builder()
                .subject(admin.getEmail())
                .issuer(jwtProperties.issuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim("tokenType", "ADMIN")
                .claim("adminId", admin.getId())
                .claim("role", "ROLE_ADMIN")
                .signWith(signingKey)
                .compact();
    }

    public String generateCheckoutToken(CheckoutSnapshot snapshot) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(jwtProperties.checkoutExpirationMinutes(), ChronoUnit.MINUTES);
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "CHECKOUT");
        claims.put("razorpayOrderId", snapshot.razorpayOrderId());
        claims.put("paymentMode", snapshot.paymentMode());
        claims.put("customerName", snapshot.customerName());
        claims.put("phone", snapshot.phone());
        claims.put("address", snapshot.address());
        claims.put("pincode", snapshot.pincode());
        claims.put("totalAmount", snapshot.totalAmount());
        claims.put("items", snapshot.items());

        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claims(claims)
                .signWith(signingKey)
                .compact();
    }

    public CheckoutSnapshot parseCheckoutToken(String token) {
        try {
            Claims claims = parseClaims(token);
            if (!"CHECKOUT".equals(claims.get("tokenType", String.class))) {
                throw new BadRequestException("Invalid checkout token");
            }

            Object items = claims.get("items");
            return new CheckoutSnapshot(
                    claims.get("razorpayOrderId", String.class),
                    claims.get("paymentMode", String.class),
                    claims.get("customerName", String.class),
                    claims.get("phone", String.class),
                    claims.get("address", String.class),
                    claims.get("pincode", String.class),
                    new java.math.BigDecimal(String.valueOf(claims.get("totalAmount"))),
                    CheckoutSnapshot.itemListFrom(items)
            );
        } catch (JwtException | IllegalArgumentException exception) {
            throw new BadRequestException("Invalid or expired checkout token");
        }
    }

    public String extractAdminUsername(String token) {
        try {
            Claims claims = parseClaims(token);
            if (!"ADMIN".equals(claims.get("tokenType", String.class))) {
                return null;
            }
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException exception) {
            return null;
        }
    }

    public boolean isAdminTokenValid(String token, UserDetails userDetails) {
        String username = extractAdminUsername(token);
        return username != null && username.equalsIgnoreCase(userDetails.getUsername()) && !isExpired(token);
    }

    public long getAdminExpirationSeconds() {
        return jwtProperties.expirationMinutes() * 60;
    }

    private boolean isExpired(String token) {
        try {
            return parseClaims(token).getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException exception) {
            return true;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey buildKey(String secret) {
        try {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        } catch (RuntimeException ignored) {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }
}
