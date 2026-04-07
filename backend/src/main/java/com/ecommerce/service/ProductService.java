package com.ecommerce.service;

import com.ecommerce.dto.ProductMediaRequest;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductMedia;
import com.ecommerce.entity.ProductMediaType;
import com.ecommerce.entity.Section;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.NotFoundException;
import com.ecommerce.exception.ResourceConflictException;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.mapper.ProductMediaSerializer;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SectionRepository sectionRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductMapper productMapper;
    private final ProductMediaSerializer productMediaSerializer;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        return productMapper.toResponse(getProductEntity(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Section section = getSection(request.sectionId());
        List<NormalizedMediaItem> mediaItems = normalizeMediaItems(request);
        MediaSummary mediaSummary = summarizeMedia(mediaItems);

        Product product = Product.builder()
                .name(request.name().trim())
                .brand(request.brand().trim())
                .description(request.description().trim())
                .fullDescription(request.fullDescription().trim())
                .price(request.price())
                .discountPercentage(request.discountPercentage())
                .stockQuantity(request.stockQuantity())
                .sku(resolveSku(request.sku(), request.name(), null))
                .lowStockAlertEnabled(request.lowStockAlertEnabled())
                .section(section)
                .imageUrl(mediaSummary.primaryImageUrl())
                .imageUrlsJson(productMediaSerializer.toJson(mediaSummary.imageUrls()))
                .videoUrl(mediaSummary.primaryVideoUrl())
                .build();
        product.replaceMediaItems(toEntities(mediaItems));

        Product saved = productRepository.save(product);
        if (!StringUtils.hasText(saved.getSku())) {
            saved.setSku(resolveSku(null, saved.getName(), saved.getId()));
        }
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = getProductEntity(id);
        Section section = getSection(request.sectionId());
        List<NormalizedMediaItem> mediaItems = normalizeMediaItems(request);
        MediaSummary mediaSummary = summarizeMedia(mediaItems);

        product.setName(request.name().trim());
        product.setBrand(request.brand().trim());
        product.setDescription(request.description().trim());
        product.setFullDescription(request.fullDescription().trim());
        product.setPrice(request.price());
        product.setDiscountPercentage(request.discountPercentage());
        product.setStockQuantity(request.stockQuantity());
        product.setSku(resolveSku(request.sku(), request.name(), product.getId()));
        product.setLowStockAlertEnabled(request.lowStockAlertEnabled());
        product.setSection(section);
        product.setImageUrl(mediaSummary.primaryImageUrl());
        product.setImageUrlsJson(productMediaSerializer.toJson(mediaSummary.imageUrls()));
        product.setVideoUrl(mediaSummary.primaryVideoUrl());
        product.replaceMediaItems(toEntities(mediaItems));
        return productMapper.toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductEntity(id);
        long linkedOrderItems = orderItemRepository.countByProductId(id);
        if (linkedOrderItems > 0) {
            throw new ResourceConflictException("This product is already part of saved orders and cannot be deleted. Update its stock, pricing, or media instead.");
        }
        productRepository.delete(product);
    }

    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with id " + id));
    }

    private Section getSection(Long sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new NotFoundException("Section not found with id " + sectionId));
    }

    private List<NormalizedMediaItem> normalizeMediaItems(ProductRequest request) {
        if (request.mediaList() != null) {
            List<NormalizedMediaItem> fromMediaList = dedupeMediaItems(request.mediaList().stream()
                    .map(this::normalizeMediaItem)
                    .toList());
            validateMediaItems(fromMediaList);
            return fromMediaList;
        }

        List<NormalizedMediaItem> legacyMediaItems = normalizeLegacyMediaItems(
                request.imageUrls(),
                request.imageUrl(),
                request.videoUrl()
        );
        validateMediaItems(legacyMediaItems);
        return legacyMediaItems;
    }

    private List<NormalizedMediaItem> normalizeLegacyMediaItems(List<String> imageUrls, String fallbackImageUrl, String videoUrl) {
        List<NormalizedMediaItem> mediaItems = new ArrayList<>();
        normalizeImageUrls(imageUrls, fallbackImageUrl).forEach(url -> mediaItems.add(new NormalizedMediaItem(url, ProductMediaType.IMAGE)));

        String normalizedVideoUrl = blankToNull(videoUrl);
        if (normalizedVideoUrl != null) {
            mediaItems.add(new NormalizedMediaItem(normalizedVideoUrl, ProductMediaType.VIDEO));
        }

        return dedupeMediaItems(mediaItems);
    }

    private NormalizedMediaItem normalizeMediaItem(ProductMediaRequest mediaItem) {
        String url = blankToNull(mediaItem.url());
        if (url == null) {
            throw new BadRequestException("Product media URL is required");
        }

        try {
            return new NormalizedMediaItem(url, ProductMediaType.fromValue(mediaItem.type()));
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Product media type must be image or video");
        }
    }

    private List<NormalizedMediaItem> dedupeMediaItems(List<NormalizedMediaItem> mediaItems) {
        if (mediaItems == null || mediaItems.isEmpty()) {
            return List.of();
        }

        LinkedHashSet<String> seen = new LinkedHashSet<>();
        return mediaItems.stream()
                .filter(mediaItem -> mediaItem.url() != null && !mediaItem.url().isBlank())
                .filter(mediaItem -> seen.add(mediaItem.type().name() + "|" + mediaItem.url()))
                .toList();
    }

    private void validateMediaItems(List<NormalizedMediaItem> mediaItems) {
        boolean hasImage = mediaItems.stream().anyMatch(mediaItem -> mediaItem.type() == ProductMediaType.IMAGE);
        if (!hasImage) {
            throw new BadRequestException("Add at least one image to the product gallery.");
        }
    }

    private List<ProductMedia> toEntities(List<NormalizedMediaItem> mediaItems) {
        return IntStream.range(0, mediaItems.size())
                .mapToObj(index -> ProductMedia.builder()
                        .url(mediaItems.get(index).url())
                        .type(mediaItems.get(index).type())
                        .position(index)
                        .build())
                .toList();
    }

    private MediaSummary summarizeMedia(List<NormalizedMediaItem> mediaItems) {
        List<String> imageUrls = mediaItems.stream()
                .filter(mediaItem -> mediaItem.type() == ProductMediaType.IMAGE)
                .map(NormalizedMediaItem::url)
                .toList();
        String primaryVideoUrl = mediaItems.stream()
                .filter(mediaItem -> mediaItem.type() == ProductMediaType.VIDEO)
                .map(NormalizedMediaItem::url)
                .findFirst()
                .orElse(null);

        return new MediaSummary(
                imageUrls.isEmpty() ? null : imageUrls.get(0),
                imageUrls,
                primaryVideoUrl
        );
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private List<String> normalizeImageUrls(List<String> imageUrls, String fallbackImageUrl) {
        if (imageUrls != null && !imageUrls.isEmpty()) {
            return imageUrls.stream()
                    .filter(url -> url != null && !url.isBlank())
                    .map(String::trim)
                    .toList();
        }

        String normalizedFallback = blankToNull(fallbackImageUrl);
        if (normalizedFallback == null) {
            return List.of();
        }

        return List.of(normalizedFallback);
    }

    private String resolveSku(String requestedSku, String name, Long productId) {
        String normalizedSku = blankToNull(requestedSku);
        if (normalizedSku != null) {
            return normalizedSku.toUpperCase(Locale.ENGLISH).replace(' ', '-');
        }

        String compactName = name == null ? "ITEM" : name
                .replaceAll("[^a-zA-Z0-9]+", "-")
                .replaceAll("(^-|-$)", "")
                .toUpperCase(Locale.ENGLISH);

        String prefix = compactName.isBlank() ? "ITEM" : compactName.substring(0, Math.min(compactName.length(), 8));
        String suffix = productId == null ? String.valueOf(System.currentTimeMillis()).substring(7) : String.valueOf(productId);
        return "G69-" + prefix + "-" + suffix;
    }

    private record NormalizedMediaItem(String url, ProductMediaType type) {
    }

    private record MediaSummary(String primaryImageUrl, List<String> imageUrls, String primaryVideoUrl) {
    }
}
