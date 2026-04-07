package com.ecommerce.security;

import com.ecommerce.config.CorsProperties;
import com.ecommerce.controller.AuthController;
import com.ecommerce.controller.OrderController;
import com.ecommerce.controller.PaymentController;
import com.ecommerce.controller.ProductController;
import com.ecommerce.controller.SectionController;
import com.ecommerce.controller.UploadController;
import com.ecommerce.dto.AdminLoginResponse;
import com.ecommerce.dto.AdminSummaryResponse;
import com.ecommerce.dto.CreateOrderResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.dto.PaymentVerificationResponse;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.dto.SectionResponse;
import com.ecommerce.dto.UploadResponse;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.CloudinaryUploadService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.SectionService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        SectionController.class,
        ProductController.class,
        AuthController.class,
        PaymentController.class,
        OrderController.class,
        UploadController.class
})
@Import(SecurityConfig.class)
class ApiSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SectionService sectionService;

    @MockBean
    private ProductService productService;

    @MockBean
    private AuthService authService;

    @MockBean
    private OrderService orderService;

    @MockBean
    private CloudinaryUploadService cloudinaryUploadService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private AdminUserDetailsService adminUserDetailsService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private CorsProperties corsProperties;

    @MockBean
    private AuthenticationConfiguration authenticationConfiguration;

    @BeforeEach
    void setUp() throws Exception {
        ProductResponse product = new ProductResponse(
                7L,
                "Nebula Headphones",
                "Gadget69",
                "Studio headphones",
                "<p>Studio headphones</p>",
                new BigDecimal("12999.00"),
                10,
                14,
                "G69-AUDIO-7",
                true,
                1L,
                "Audio",
                "https://cdn.example.com/headphones.jpg",
                List.of("https://cdn.example.com/headphones.jpg"),
                null,
                List.of(),
                LocalDateTime.of(2026, 4, 7, 9, 0)
        );

        when(corsProperties.allowedOrigins()).thenReturn(List.of("http://localhost:5173"));
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(authentication -> authentication);
        doAnswer(invocation -> {
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(invocation.getArgument(0), invocation.getArgument(1));
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        when(sectionService.getAllSections()).thenReturn(List.of(new SectionResponse(1L, "Audio", 4)));
        when(productService.getAllProducts()).thenReturn(List.of(product));
        when(productService.getProduct(7L)).thenReturn(product);
        when(authService.login(any())).thenReturn(new AdminLoginResponse(
                "token-123",
                "Bearer",
                3600,
                new AdminSummaryResponse(1L, "admin@example.com")
        ));
        when(orderService.createOrder(any())).thenReturn(new CreateOrderResponse(
                "order_123",
                1299900L,
                "INR",
                "rzp_test_123",
                "checkout-token",
                true
        ));
        when(orderService.verifyPayment(any())).thenReturn(new PaymentVerificationResponse(
                19L,
                "PAID",
                new BigDecimal("12999.00"),
                LocalDateTime.of(2026, 4, 7, 9, 30),
                true
        ));
        when(orderService.getAllOrders()).thenReturn(List.of(new OrderResponse(
                19L,
                "Kavin",
                "9876543210",
                "12 Tech Park Street",
                "600001",
                new BigDecimal("12999.00"),
                "PAID",
                "order_123",
                "pay_123",
                true,
                LocalDateTime.of(2026, 4, 7, 9, 30),
                List.of()
        )));
        doNothing().when(authService).changePassword(any(), any());
        when(cloudinaryUploadService.upload(any())).thenReturn(new UploadResponse(
                "https://cdn.example.com/headphones.jpg",
                "https://cdn.example.com/headphones.jpg",
                "IMAGE",
                "image/jpeg",
                true,
                "Demo upload"
        ));
    }

    @Test
    void publicEndpointsShouldBeAccessibleWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/sections")).andExpect(status().isOk());
        mockMvc.perform(get("/products")).andExpect(status().isOk());
        mockMvc.perform(get("/products/7")).andExpect(status().isOk());
        mockMvc.perform(post("/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@example.com",
                                  "password": "change-this-password"
                                }
                                """))
                .andExpect(status().isOk());
        mockMvc.perform(post("/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerName": "Kavin",
                                  "phone": "9876543210",
                                  "address": "12 Tech Park Street",
                                  "pincode": "600001",
                                  "items": [
                                    {
                                      "productId": 7,
                                      "quantity": 1
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isOk());
        mockMvc.perform(post("/verify-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "razorpayOrderId": "order_123",
                                  "razorpayPaymentId": "pay_123",
                                  "razorpaySignature": "sig_123",
                                  "checkoutToken": "checkout-token"
                                }
                                """))
                .andExpect(status().isOk());
        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "razorpayOrderId": "order_123",
                                  "razorpayPaymentId": "pay_123",
                                  "razorpaySignature": "sig_123",
                                  "checkoutToken": "checkout-token"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void adminEndpointsShouldRejectAnonymousRequests() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "headphones.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "mock-image".getBytes()
        );

        mockMvc.perform(post("/admin/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Wearables"
                                }
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/admin/products/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Nebula Headphones",
                                  "brand": "Gadget69",
                                  "description": "Studio headphones",
                                  "fullDescription": "<p>Studio headphones</p>",
                                  "price": 12999,
                                  "discountPercentage": 10,
                                  "stockQuantity": 14,
                                  "sectionId": 1,
                                  "sku": "G69-AUDIO-7",
                                  "lowStockAlertEnabled": true
                                }
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/admin/sections/1"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/admin/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentPassword": "change-this-password",
                                  "newPassword": "new-password-123"
                                }
                                """))
                .andExpect(status().isForbidden());

        mockMvc.perform(multipart("/admin/upload").file(file))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void adminEndpointsShouldBeAccessibleForAdminUsers() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "headphones.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "mock-image".getBytes()
        );

        mockMvc.perform(post("/admin/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Wearables"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/admin/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentPassword": "change-this-password",
                                  "newPassword": "new-password-123"
                                }
                                """))
                .andExpect(status().isNoContent());

        mockMvc.perform(multipart("/admin/upload").file(file))
                .andExpect(status().isOk());
    }
}
