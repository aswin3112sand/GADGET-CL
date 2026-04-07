package com.ecommerce.mapper;

import com.ecommerce.dto.ProductMediaResponse;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductMedia;
import com.ecommerce.entity.ProductMediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ProductMediaSerializer productMediaSerializer;

    public ProductResponse toResponse(Product product) {
        List<ProductMediaResponse> mediaList = toMediaList(product);
        List<String> imageUrls = mediaList.stream()
                .filter(media -> ProductMediaType.IMAGE.apiValue().equals(media.type()))
                .map(ProductMediaResponse::url)
                .toList();
        String imageUrl = imageUrls.isEmpty() ? null : imageUrls.get(0);
        String videoUrl = mediaList.stream()
                .filter(media -> ProductMediaType.VIDEO.apiValue().equals(media.type()))
                .map(ProductMediaResponse::url)
                .findFirst()
                .orElse(null);

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getDescription(),
                product.getFullDescription(),
                product.getPrice(),
                product.getDiscountPercentage(),
                product.getStockQuantity(),
                product.getSku(),
                product.getLowStockAlertEnabled(),
                product.getSection().getId(),
                product.getSection().getName(),
                imageUrl,
                imageUrls,
                videoUrl,
                mediaList,
                product.getCreatedAt()
        );
    }

    private List<ProductMediaResponse> toMediaList(Product product) {
        if (product.getMediaItems() != null && !product.getMediaItems().isEmpty()) {
            return product.getMediaItems().stream()
                    .map(this::toMediaResponse)
                    .toList();
        }

        List<ProductMediaResponse> fallbackMedia = new ArrayList<>();
        List<String> legacyImages = productMediaSerializer.fromJson(product.getImageUrlsJson());
        if (legacyImages.isEmpty() && hasText(product.getImageUrl())) {
            legacyImages = List.of(product.getImageUrl().trim());
        }

        for (int index = 0; index < legacyImages.size(); index++) {
            fallbackMedia.add(new ProductMediaResponse(null, legacyImages.get(index), ProductMediaType.IMAGE.apiValue(), index));
        }

        if (hasText(product.getVideoUrl())) {
            fallbackMedia.add(new ProductMediaResponse(null, product.getVideoUrl().trim(), ProductMediaType.VIDEO.apiValue(), fallbackMedia.size()));
        }

        return fallbackMedia;
    }

    private ProductMediaResponse toMediaResponse(ProductMedia media) {
        return new ProductMediaResponse(
                media.getId(),
                media.getUrl(),
                media.getType().apiValue(),
                media.getPosition()
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
