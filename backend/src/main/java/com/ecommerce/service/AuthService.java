package com.ecommerce.service;

import com.ecommerce.dto.AdminChangePasswordRequest;
import com.ecommerce.dto.AdminLoginRequest;
import com.ecommerce.dto.AdminLoginResponse;
import com.ecommerce.dto.AdminSummaryResponse;
import com.ecommerce.entity.Admin;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.NotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AdminLoginResponse login(AdminLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        Admin admin = adminRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new NotFoundException("Admin account not found"));

        String token = jwtService.generateAdminToken(admin);
        return new AdminLoginResponse(
                token,
                "Bearer",
                jwtService.getAdminExpirationSeconds(),
                new AdminSummaryResponse(admin.getId(), admin.getEmail())
        );
    }

    @Transactional
    public void changePassword(String adminEmail, AdminChangePasswordRequest request) {
        Admin admin = adminRepository.findByEmailIgnoreCase(adminEmail)
                .orElseThrow(() -> new NotFoundException("Admin account not found"));

        if (!passwordEncoder.matches(request.currentPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), admin.getPassword())) {
            throw new BadRequestException("New password must be different from the current password.");
        }

        admin.setPassword(passwordEncoder.encode(request.newPassword()));
        adminRepository.save(admin);
    }
}
