package com.ecommerce.controller;

import com.ecommerce.dto.AdminChangePasswordRequest;
import com.ecommerce.dto.AdminLoginRequest;
import com.ecommerce.dto.AdminLoginResponse;
import com.ecommerce.dto.AdminSummaryResponse;
import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.CreateOrderResponse;
import com.ecommerce.dto.OrderItemResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.dto.PaymentVerificationResponse;
import com.ecommerce.dto.ProductMediaRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.dto.SectionRequest;
import com.ecommerce.dto.SectionResponse;
import com.ecommerce.dto.UploadResponse;
import com.ecommerce.dto.VerifyPaymentRequest;
import com.ecommerce.config.CorsProperties;
import com.ecommerce.security.AdminUserDetailsService;
import com.ecommerce.security.JwtAuthenticationFilter;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.CloudinaryUploadService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.SectionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        SectionController.class,
        ProductController.class,
        AuthController.class,
        PaymentController.class,
        OrderController.class,
        UploadController.class
})
@AutoConfigureMockMvc(addFilters = false)
class ApiControllerContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
        when(corsProperties.allowedOrigins()).thenReturn(List.of("http://localhost:5173"));
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(authentication -> authentication);
    }

    @Test
    void getSectionsShouldReturnCachedResponse() throws Exception {
        when(sectionService.getAllSections()).thenReturn(List.of(new SectionResponse(1L, "Audio", 4)));

        mockMvc.perform(get("/sections"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=30, public"))
                .andExpect(header().string("CDN-Cache-Control", "public, max-age=30"))
                .andExpect(jsonPath("$[0].name").value("Audio"));
    }

    @Test
    void createAndUpdateSectionShouldReturnSavedSection() throws Exception {
        SectionResponse section = new SectionResponse(10L, "Wearables", 0);
        when(sectionService.createSection(any(SectionRequest.class))).thenReturn(section);
        when(sectionService.updateSection(eq(10L), any(SectionRequest.class))).thenReturn(section);

        String body = objectMapper.writeValueAsString(new SectionRequest("Wearables"));

        mockMvc.perform(post("/admin/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));

        mockMvc.perform(put("/admin/sections/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Wearables"));
    }

    @Test
    void deleteSectionShouldReturnNoContent() throws Exception {
        doNothing().when(sectionService).deleteSection(4L);

        mockMvc.perform(delete("/admin/sections/4"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getProductsAndProductDetailsShouldReturnCachedResponses() throws Exception {
        ProductResponse product = sampleProduct();
        when(productService.getAllProducts()).thenReturn(List.of(product));
        when(productService.getProduct(7L)).thenReturn(product);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=30, public"))
                .andExpect(header().string("CDN-Cache-Control", "public, max-age=30"))
                .andExpect(jsonPath("$[0].name").value("Nebula Headphones"));

        mockMvc.perform(get("/products/7"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=30, public"))
                .andExpect(header().string("CDN-Cache-Control", "public, max-age=30"))
                .andExpect(jsonPath("$.sectionName").value("Audio"));
    }

    @Test
    void createUpdateAndDeleteProductShouldSucceed() throws Exception {
        ProductResponse product = sampleProduct();
        when(productService.createProduct(any())).thenReturn(product);
        when(productService.updateProduct(eq(7L), any())).thenReturn(product);
        doNothing().when(productService).deleteProduct(7L);

        String productJson = """
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
                  "lowStockAlertEnabled": true,
                  "mediaList": [
                    {
                      "url": "https://cdn.example.com/headphones.jpg",
                      "type": "IMAGE",
                      "position": 0
                    }
                  ]
                }
                """;

        mockMvc.perform(post("/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7));

        mockMvc.perform(put("/admin/products/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku").value("G69-AUDIO-7"));

        mockMvc.perform(delete("/admin/products/7"))
                .andExpect(status().isNoContent());
    }

    @Test
    void loginAndChangePasswordShouldUseAuthService() throws Exception {
        AdminLoginResponse loginResponse = new AdminLoginResponse(
                "token-123",
                "Bearer",
                3600,
                new AdminSummaryResponse(1L, "admin@example.com")
        );
        when(authService.login(any(AdminLoginRequest.class))).thenReturn(loginResponse);
        doNothing().when(authService).changePassword(eq("admin@example.com"), any(AdminChangePasswordRequest.class));

        mockMvc.perform(post("/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@example.com",
                                  "password": "change-this-password"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-123"))
                .andExpect(jsonPath("$.admin.email").value("admin@example.com"));

        mockMvc.perform(post("/admin/change-password")
                        .principal(new UsernamePasswordAuthenticationToken("admin@example.com", "n/a"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentPassword": "change-this-password",
                                  "newPassword": "new-password-123"
                                }
                                """))
                .andExpect(status().isNoContent());
    }

    @Test
    void createVerifyAndPersistOrderShouldReturnVerificationResponses() throws Exception {
        CreateOrderResponse createOrderResponse = new CreateOrderResponse(
                "order_123",
                1299900L,
                "INR",
                "rzp_test_123",
                "checkout-token",
                true
        );
        PaymentVerificationResponse verificationResponse = new PaymentVerificationResponse(
                19L,
                "PAID",
                new BigDecimal("12999.00"),
                LocalDateTime.of(2026, 4, 7, 9, 30),
                true
        );
        when(orderService.createOrder(any(CreateOrderRequest.class))).thenReturn(createOrderResponse);
        when(orderService.verifyPayment(any(VerifyPaymentRequest.class))).thenReturn(verificationResponse);

        String createOrderJson = """
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
                """;

        String verifyJson = """
                {
                  "razorpayOrderId": "order_123",
                  "razorpayPaymentId": "pay_123",
                  "razorpaySignature": "sig_123",
                  "checkoutToken": "checkout-token"
                }
                """;

        mockMvc.perform(post("/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createOrderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.razorpayOrderId").value("order_123"));

        mockMvc.perform(post("/verify-payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(verifyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus").value("PAID"));

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(verifyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(19));
    }

    @Test
    void adminOrdersAndUploadShouldReturnExpectedPayloads() throws Exception {
        OrderResponse order = new OrderResponse(
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
                List.of(new OrderItemResponse(7L, "Nebula Headphones", 1, new BigDecimal("12999.00")))
        );
        UploadResponse uploadResponse = new UploadResponse(
                "https://cdn.example.com/headphones.jpg",
                "https://cdn.example.com/headphones.jpg",
                "IMAGE",
                "image/jpeg",
                true,
                "Demo upload"
        );

        when(orderService.getAllOrders()).thenReturn(List.of(order));
        when(cloudinaryUploadService.upload(any())).thenReturn(uploadResponse);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "headphones.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "mock-image".getBytes()
        );

        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("Kavin"))
                .andExpect(jsonPath("$[0].items[0].productName").value("Nebula Headphones"));

        mockMvc.perform(multipart("/admin/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.secureUrl").value("https://cdn.example.com/headphones.jpg"));
    }

    @Test
    void invalidRequestsShouldReturnValidationErrorPayload() throws Exception {
        mockMvc.perform(post("/admin/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));

        mockMvc.perform(post("/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "customerName": "Kavin",
                                  "phone": "1234",
                                  "address": "12 Tech Park Street",
                                  "pincode": "600001",
                                  "items": []
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    private ProductResponse sampleProduct() {
        return new ProductResponse(
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
                List.of(new com.ecommerce.dto.ProductMediaResponse(
                        1L,
                        "https://cdn.example.com/headphones.jpg",
                        "IMAGE",
                        0
                )),
                LocalDateTime.of(2026, 4, 7, 9, 0)
        );
    }
}
