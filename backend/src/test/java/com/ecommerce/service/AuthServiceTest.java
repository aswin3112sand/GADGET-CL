package com.ecommerce.service;

import com.ecommerce.dto.AdminChangePasswordRequest;
import com.ecommerce.entity.Admin;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(authenticationManager, adminRepository, jwtService, passwordEncoder);
    }

    @Test
    void changePasswordShouldPersistEncodedReplacement() {
        Admin admin = Admin.builder()
                .id(1L)
                .email("admin@example.com")
                .password("encoded-current")
                .build();

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("current-password", "encoded-current")).thenReturn(true);
        when(passwordEncoder.matches("new-password-123", "encoded-current")).thenReturn(false);
        when(passwordEncoder.encode("new-password-123")).thenReturn("encoded-new");

        authService.changePassword("admin@example.com", new AdminChangePasswordRequest("current-password", "new-password-123"));

        assertEquals("encoded-new", admin.getPassword());
        verify(adminRepository).save(admin);
    }

    @Test
    void changePasswordShouldRejectIncorrectCurrentPassword() {
        Admin admin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-current")
                .build();

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong-password", "encoded-current")).thenReturn(false);

        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () ->
                authService.changePassword("admin@example.com", new AdminChangePasswordRequest("wrong-password", "new-password-123"))
        );

        assertEquals("Current password is incorrect", exception.getMessage());
        verify(adminRepository, never()).save(admin);
    }

    @Test
    void changePasswordShouldRejectReusingCurrentPassword() {
        Admin admin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-current")
                .build();

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("current-password", "encoded-current")).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                authService.changePassword("admin@example.com", new AdminChangePasswordRequest("current-password", "current-password"))
        );

        assertEquals("New password must be different from the current password.", exception.getMessage());
        verify(adminRepository, never()).save(admin);
    }
}
