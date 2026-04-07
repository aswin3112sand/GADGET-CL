package com.ecommerce.service;

import com.ecommerce.config.AdminBootstrapProperties;
import com.ecommerce.entity.Admin;
import com.ecommerce.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Environment environment;

    @Test
    void bootstrapAdminShouldCreateAdminWhenMissing() {
        AdminBootstrapService service = serviceWith(false);

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("change-this-password")).thenReturn("encoded-password");

        service.bootstrapAdmin();

        ArgumentCaptor<Admin> adminCaptor = ArgumentCaptor.forClass(Admin.class);
        verify(adminRepository).save(adminCaptor.capture());

        Admin savedAdmin = adminCaptor.getValue();
        assertEquals("admin@example.com", savedAdmin.getEmail());
        assertEquals("encoded-password", savedAdmin.getPassword());
    }

    @Test
    void bootstrapAdminShouldLeaveExistingPasswordWhenResetFlagDisabled() {
        AdminBootstrapService service = serviceWith(false);
        Admin existingAdmin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-existing")
                .build();

        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(existingAdmin));

        service.bootstrapAdmin();

        assertEquals("encoded-existing", existingAdmin.getPassword());
        verify(adminRepository, never()).save(any(Admin.class));
        verify(passwordEncoder, never()).encode(any(String.class));
    }

    @Test
    void bootstrapAdminShouldResetExistingPasswordWhenLocalProfileAndFlagEnabled() {
        AdminBootstrapService service = serviceWith(true);
        Admin existingAdmin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-existing")
                .build();

        when(environment.getActiveProfiles()).thenReturn(new String[]{"local"});
        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(existingAdmin));
        when(passwordEncoder.matches("change-this-password", "encoded-existing")).thenReturn(false);
        when(passwordEncoder.encode("change-this-password")).thenReturn("encoded-reset");

        service.bootstrapAdmin();

        assertEquals("encoded-reset", existingAdmin.getPassword());
        verify(adminRepository).save(existingAdmin);
    }

    @Test
    void bootstrapAdminShouldNotSaveWhenConfiguredPasswordAlreadyMatches() {
        AdminBootstrapService service = serviceWith(true);
        Admin existingAdmin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-existing")
                .build();

        when(environment.getActiveProfiles()).thenReturn(new String[]{"local"});
        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(existingAdmin));
        when(passwordEncoder.matches("change-this-password", "encoded-existing")).thenReturn(true);

        service.bootstrapAdmin();

        assertEquals("encoded-existing", existingAdmin.getPassword());
        verify(adminRepository, never()).save(any(Admin.class));
        verify(passwordEncoder, never()).encode(any(String.class));
    }

    @Test
    void bootstrapAdminShouldSkipResetOutsideLocalProfile() {
        AdminBootstrapService service = serviceWith(true);
        Admin existingAdmin = Admin.builder()
                .email("admin@example.com")
                .password("encoded-existing")
                .build();

        when(environment.getActiveProfiles()).thenReturn(new String[]{"prod"});
        when(adminRepository.findByEmailIgnoreCase("admin@example.com")).thenReturn(Optional.of(existingAdmin));

        service.bootstrapAdmin();

        assertEquals("encoded-existing", existingAdmin.getPassword());
        verify(adminRepository, never()).save(any(Admin.class));
        verify(passwordEncoder, never()).encode(any(String.class));
    }

    private AdminBootstrapService serviceWith(boolean resetExistingPassword) {
        AdminBootstrapProperties properties = new AdminBootstrapProperties(
                true,
                "admin@example.com",
                "change-this-password",
                resetExistingPassword
        );
        return new AdminBootstrapService(properties, adminRepository, passwordEncoder, environment);
    }
}
