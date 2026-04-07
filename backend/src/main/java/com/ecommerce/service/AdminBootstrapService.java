package com.ecommerce.service;

import com.ecommerce.config.AdminBootstrapProperties;
import com.ecommerce.entity.Admin;
import com.ecommerce.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminBootstrapService {

    private final AdminBootstrapProperties bootstrapProperties;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapAdmin() {
        if (!bootstrapProperties.enabled()) {
            log.info("Admin bootstrap disabled");
            return;
        }

        if (!StringUtils.hasText(bootstrapProperties.email()) || !StringUtils.hasText(bootstrapProperties.password())) {
            log.warn("Admin bootstrap skipped because ADMIN_EMAIL or ADMIN_PASSWORD is not configured");
            return;
        }

        String email = bootstrapProperties.email().trim().toLowerCase();
        String configuredPassword = bootstrapProperties.password();
        Admin existingAdmin = adminRepository.findByEmailIgnoreCase(email).orElse(null);
        if (existingAdmin != null) {
            handleExistingAdmin(existingAdmin, email, configuredPassword);
            return;
        }

        Admin admin = Admin.builder()
                .email(email)
                .password(passwordEncoder.encode(configuredPassword))
                .build();

        adminRepository.save(admin);
        log.info("Bootstrap admin created for {}", admin.getEmail());
    }

    private void handleExistingAdmin(Admin existingAdmin, String email, String configuredPassword) {
        if (!bootstrapProperties.resetExistingPassword()) {
            log.info("Bootstrap admin already exists, leaving stored password unchanged: {}", email);
            return;
        }

        if (!isLocalProfileActive()) {
            log.warn("Admin bootstrap password reset skipped for {} because the local profile is not active", email);
            return;
        }

        if (StringUtils.hasText(existingAdmin.getPassword())
                && passwordEncoder.matches(configuredPassword, existingAdmin.getPassword())) {
            log.info("Bootstrap admin already matches the configured local password: {}", email);
            return;
        }

        existingAdmin.setPassword(passwordEncoder.encode(configuredPassword));
        adminRepository.save(existingAdmin);
        log.info("Bootstrap admin password reset for {}", email);
    }

    private boolean isLocalProfileActive() {
        return Arrays.stream(environment.getActiveProfiles())
                .anyMatch(profile -> "local".equalsIgnoreCase(profile));
    }
}
