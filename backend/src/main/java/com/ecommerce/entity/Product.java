package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 160)
    @Builder.Default
    private String brand = "Gadget69";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "full_description", nullable = false, columnDefinition = "TEXT")
    private String fullDescription;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_percentage", nullable = false)
    @Builder.Default
    private Integer discountPercentage = 0;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(length = 120)
    private String sku;

    @Column(name = "low_stock_alert_enabled", nullable = false)
    @Builder.Default
    private Boolean lowStockAlertEnabled = Boolean.TRUE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(name = "image_urls", nullable = false, columnDefinition = "TEXT")
    @Builder.Default
    private String imageUrlsJson = "[]";

    @Column(name = "video_url", length = 1024)
    private String videoUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC, id ASC")
    @Builder.Default
    private List<ProductMedia> mediaItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public void replaceMediaItems(List<ProductMedia> nextMediaItems) {
        mediaItems.clear();
        if (nextMediaItems == null || nextMediaItems.isEmpty()) {
            return;
        }

        nextMediaItems.forEach(this::addMediaItem);
    }

    public void addMediaItem(ProductMedia mediaItem) {
        mediaItem.setProduct(this);
        mediaItems.add(mediaItem);
    }
}
