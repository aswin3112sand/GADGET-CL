package com.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ecommerce.config.CloudinaryProperties;
import com.ecommerce.config.DemoProperties;
import com.ecommerce.config.UploadProperties;
import com.ecommerce.dto.UploadResponse;
import com.ecommerce.entity.ProductMediaType;
import com.ecommerce.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryUploadService {

    private final Cloudinary cloudinary;
    private final CloudinaryProperties cloudinaryProperties;
    private final DemoProperties demoProperties;
    private final UploadProperties uploadProperties;

    public UploadResponse upload(MultipartFile file) {
        validate(file);
        ProductMediaType mediaType = resolveMediaType(file.getContentType());
        if (!isCloudinaryConfigured()) {
            if (demoProperties.enabled()) {
                String demoUrl = resolveDemoUrl(mediaType);
                return createUploadResponse(demoUrl, mediaType, true, "Demo asset attached because Cloudinary is not configured.");
            }
            throw new BadRequestException("Cloudinary is not configured on the backend. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
        }

        try {
            Map<?, ?> response = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", cloudinaryProperties.folder(),
                            "public_id", UUID.randomUUID().toString(),
                            "quality", "auto"
                    )
            );

            Object secureUrlValue = response.get("secure_url");
            String secureUrl = secureUrlValue == null ? null : secureUrlValue.toString();
            if (!StringUtils.hasText(secureUrl)) {
                throw new BadRequestException("Cloudinary upload did not return a secure URL");
            }

            return createUploadResponse(secureUrl, mediaType, false, "Uploaded to Cloudinary.");
        } catch (IOException exception) {
            log.error("Cloudinary upload failed", exception);
            throw new BadRequestException("Unable to upload file to Cloudinary. Check the file, credentials, and network access.");
        } catch (Exception exception) {
            log.error("Cloudinary upload failed", exception);
            throw new BadRequestException("Cloudinary upload failed. Check Cloudinary credentials, folder configuration, and network access.");
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A file is required");
        }

        long maxBytes = uploadProperties.maxFileSizeMb() * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new BadRequestException("File exceeds maximum allowed size of " + uploadProperties.maxFileSizeMb() + " MB");
        }

        resolveMediaType(file.getContentType());
    }

    private ProductMediaType resolveMediaType(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            throw new BadRequestException("Unable to determine uploaded file type");
        }
        if (contentType.startsWith("image/")) {
            return ProductMediaType.IMAGE;
        }
        if (contentType.startsWith("video/")) {
            return ProductMediaType.VIDEO;
        }
        throw new BadRequestException("Only image and video uploads are supported");
    }

    private boolean isCloudinaryConfigured() {
        return StringUtils.hasText(cloudinaryProperties.cloudName())
                && StringUtils.hasText(cloudinaryProperties.apiKey())
                && StringUtils.hasText(cloudinaryProperties.apiSecret());
    }

    private String resolveDemoUrl(ProductMediaType mediaType) {
        return mediaType == ProductMediaType.VIDEO ? demoProperties.sampleVideoUrl() : demoProperties.sampleImageUrl();
    }

    private UploadResponse createUploadResponse(String secureUrl, ProductMediaType mediaType, boolean demoMode, String note) {
        return new UploadResponse(
                secureUrl,
                secureUrl,
                mediaType.apiValue(),
                mediaType.name(),
                demoMode,
                note
        );
    }
}
