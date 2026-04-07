package com.ecommerce.service;

import com.ecommerce.dto.ProductMediaRequest;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Section;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceConflictException;
import com.ecommerce.mapper.ProductMediaSerializer;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SectionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        ProductMediaSerializer productMediaSerializer = new ProductMediaSerializer(new ObjectMapper());
        productService = new ProductService(
                productRepository,
                sectionRepository,
                orderItemRepository,
                new ProductMapper(productMediaSerializer),
                productMediaSerializer
        );
    }

    @Test
    void createProductShouldPersistStockAndNormalizeBlankMedia() {
        Section section = Section.builder().id(7L).name("Phones").build();
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(12L);
            return product;
        });

        ProductResponse response = productService.createProduct(new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                null,
                java.util.List.of("https://cdn.example.com/phone.jpg"),
                "https://cdn.example.com/phone.jpg",
                " "
        ));

        assertEquals(12L, response.id());
        assertEquals("Nova X Pro", response.name());
        assertEquals("Gadget69", response.brand());
        assertEquals(12, response.discountPercentage());
        assertEquals(9, response.stockQuantity());
        assertEquals("G69-NOVA-1234", response.sku());
        assertEquals("Phones", response.sectionName());
        assertEquals("https://cdn.example.com/phone.jpg", response.imageUrl());
        assertEquals(1, response.imageUrls().size());
        assertNull(response.videoUrl());
        assertEquals(1, response.mediaList().size());
        assertEquals("image", response.mediaList().get(0).type());
    }

    @Test
    void createProductShouldPersistOrderedMixedMediaList() {
        Section section = Section.builder().id(7L).name("Phones").build();
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(18L);
            product.getMediaItems().forEach(item -> item.setId((long) (item.getPosition() + 100)));
            return product;
        });

        ProductResponse response = productService.createProduct(new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                List.of(
                        new ProductMediaRequest("https://cdn.example.com/phone-front.jpg", "image"),
                        new ProductMediaRequest("https://cdn.example.com/phone-demo.mp4", "video"),
                        new ProductMediaRequest("https://cdn.example.com/phone-back.jpg", "image")
                ),
                List.of("https://cdn.example.com/legacy.jpg"),
                "https://cdn.example.com/legacy.jpg",
                "https://cdn.example.com/legacy.mp4"
        ));

        assertEquals("https://cdn.example.com/phone-front.jpg", response.imageUrl());
        assertEquals(List.of(
                "https://cdn.example.com/phone-front.jpg",
                "https://cdn.example.com/phone-back.jpg"
        ), response.imageUrls());
        assertEquals("https://cdn.example.com/phone-demo.mp4", response.videoUrl());
        assertEquals(3, response.mediaList().size());
        assertEquals("image", response.mediaList().get(0).type());
        assertEquals("video", response.mediaList().get(1).type());
        assertEquals(1, response.mediaList().get(1).position());
    }

    @Test
    void deleteProductShouldRejectWhenReferencedBySavedOrders() {
        Product product = Product.builder().id(9L).name("Nova X Pro").build();
        when(productRepository.findById(9L)).thenReturn(Optional.of(product));
        when(orderItemRepository.countByProductId(9L)).thenReturn(1L);

        ResourceConflictException exception = assertThrows(ResourceConflictException.class, () -> productService.deleteProduct(9L));

        assertEquals("This product is already part of saved orders and cannot be deleted. Update its stock, pricing, or media instead.", exception.getMessage());
        verify(productRepository, never()).delete(product);
    }

    @Test
    void updateProductShouldPersistReplacementVideoUrl() {
        Section section = Section.builder().id(7L).name("Phones").build();
        Product product = existingProduct(section);
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));

        ProductResponse response = productService.updateProduct(12L, new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                null,
                List.of("https://cdn.example.com/phone.jpg"),
                "https://cdn.example.com/phone.jpg",
                "https://cdn.example.com/video-new.mp4"
        ));

        assertEquals("https://cdn.example.com/video-new.mp4", product.getVideoUrl());
        assertEquals("https://cdn.example.com/video-new.mp4", response.videoUrl());
    }

    @Test
    void updateProductShouldClearVideoUrlWhenBlankValueIsSubmitted() {
        Section section = Section.builder().id(7L).name("Phones").build();
        Product product = existingProduct(section);
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));

        ProductResponse response = productService.updateProduct(12L, new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                null,
                List.of("https://cdn.example.com/phone.jpg"),
                "https://cdn.example.com/phone.jpg",
                "   "
        ));

        assertNull(product.getVideoUrl());
        assertNull(response.videoUrl());
    }

    @Test
    void updateProductShouldUseMediaListAsSourceOfTruth() {
        Section section = Section.builder().id(7L).name("Phones").build();
        Product product = existingProduct(section);
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));

        ProductResponse response = productService.updateProduct(12L, new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                List.of(
                        new ProductMediaRequest("https://cdn.example.com/video-new.mp4", "video"),
                        new ProductMediaRequest("https://cdn.example.com/phone-hero.jpg", "image"),
                        new ProductMediaRequest("https://cdn.example.com/phone-side.jpg", "image")
                ),
                List.of("https://cdn.example.com/legacy-phone.jpg"),
                "https://cdn.example.com/legacy-phone.jpg",
                "https://cdn.example.com/legacy-video.mp4"
        ));

        assertEquals("https://cdn.example.com/phone-hero.jpg", product.getImageUrl());
        assertEquals("[\"https://cdn.example.com/phone-hero.jpg\",\"https://cdn.example.com/phone-side.jpg\"]", product.getImageUrlsJson());
        assertEquals("https://cdn.example.com/video-new.mp4", product.getVideoUrl());
        assertEquals(3, product.getMediaItems().size());
        assertEquals("video", response.mediaList().get(0).type());
        assertEquals("https://cdn.example.com/phone-hero.jpg", response.imageUrl());
    }

    @Test
    void createProductShouldRejectMediaListWithoutAnImage() {
        Section section = Section.builder().id(7L).name("Phones").build();
        when(sectionRepository.findById(7L)).thenReturn(Optional.of(section));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> productService.createProduct(new ProductRequest(
                " Nova X Pro ",
                " Gadget69 ",
                " Flagship phone ",
                "<p>Flagship phone</p>",
                new BigDecimal("49999.00"),
                12,
                9,
                7L,
                "G69-NOVA-1234",
                true,
                List.of(new ProductMediaRequest("https://cdn.example.com/video-only.mp4", "video")),
                null,
                null,
                null
        )));

        assertEquals("Add at least one image to the product gallery.", exception.getMessage());
    }

    private Product existingProduct(Section section) {
        return Product.builder()
                .id(12L)
                .name("Nova X Pro")
                .brand("Gadget69")
                .description("Flagship phone")
                .fullDescription("<p>Flagship phone</p>")
                .price(new BigDecimal("49999.00"))
                .discountPercentage(12)
                .stockQuantity(9)
                .sku("G69-NOVA-1234")
                .lowStockAlertEnabled(true)
                .section(section)
                .imageUrl("https://cdn.example.com/phone.jpg")
                .imageUrlsJson("[\"https://cdn.example.com/phone.jpg\"]")
                .videoUrl("https://cdn.example.com/video-old.mp4")
                .build();
    }
}
