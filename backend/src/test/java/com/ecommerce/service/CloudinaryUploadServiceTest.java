package com.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.ecommerce.config.CloudinaryProperties;
import com.ecommerce.config.DemoProperties;
import com.ecommerce.config.UploadProperties;
import com.ecommerce.dto.UploadResponse;
import com.ecommerce.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CloudinaryUploadServiceTest {

    private static final int MAX_UPLOAD_MB = 200;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    private UploadProperties uploadProperties;

    @BeforeEach
    void setUp() {
        uploadProperties = new UploadProperties(MAX_UPLOAD_MB);
    }

    @Test
    void uploadShouldUseCloudinaryForConfiguredVideoUploads() throws Exception {
        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(Map.of(
                "secure_url", "https://res.cloudinary.com/demo/video/upload/v1/catalog/demo.mp4"
        ));

        CloudinaryUploadService service = new CloudinaryUploadService(
                cloudinary,
                new CloudinaryProperties("demo-cloud", "demo-key", "demo-secret", "ecommerce"),
                new DemoProperties(false, "https://example.com/demo-image.jpg", "https://example.com/demo-video.mp4"),
                uploadProperties
        );

        UploadResponse response = service.upload(new MockMultipartFile(
                "file",
                "demo.mp4",
                "video/mp4",
                "demo-video".getBytes()
        ));

        assertEquals("VIDEO", response.mediaType());
        assertEquals("video", response.type());
        assertEquals("https://res.cloudinary.com/demo/video/upload/v1/catalog/demo.mp4", response.url());
        assertEquals("https://res.cloudinary.com/demo/video/upload/v1/catalog/demo.mp4", response.secureUrl());
        assertFalse(response.demoMode());
        assertEquals("Uploaded to Cloudinary.", response.note());

        verify(uploader).upload(
                any(byte[].class),
                argThat(options -> "auto".equals(options.get("resource_type"))
                        && "ecommerce".equals(options.get("folder"))
                        && "auto".equals(options.get("quality"))
                        && options.get("public_id") instanceof String publicId
                        && !publicId.isBlank())
        );
    }

    @Test
    void uploadShouldReturnDemoVideoWhenCloudinaryIsMissingButDemoModeIsEnabled() {
        CloudinaryUploadService service = new CloudinaryUploadService(
                cloudinary,
                new CloudinaryProperties("", "", "", "ecommerce"),
                new DemoProperties(true, "https://example.com/demo-image.jpg", "https://example.com/demo-video.mp4"),
                uploadProperties
        );

        UploadResponse response = service.upload(new MockMultipartFile(
                "file",
                "demo.mp4",
                "video/mp4",
                "demo-video".getBytes()
        ));

        assertEquals("VIDEO", response.mediaType());
        assertEquals("video", response.type());
        assertEquals("https://example.com/demo-video.mp4", response.url());
        assertEquals("https://example.com/demo-video.mp4", response.secureUrl());
        assertTrue(response.demoMode());
        verifyNoInteractions(cloudinary);
    }

    @Test
    void uploadShouldExplainMissingCloudinaryConfigWhenDemoModeIsDisabled() {
        CloudinaryUploadService service = new CloudinaryUploadService(
                cloudinary,
                new CloudinaryProperties("", "", "", "ecommerce"),
                new DemoProperties(false, "https://example.com/demo-image.jpg", "https://example.com/demo-video.mp4"),
                uploadProperties
        );

        BadRequestException exception = assertThrows(BadRequestException.class, () -> service.upload(new MockMultipartFile(
                "file",
                "demo.mp4",
                "video/mp4",
                "demo-video".getBytes()
        )));

        assertEquals("Cloudinary is not configured on the backend. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.", exception.getMessage());
        verifyNoInteractions(cloudinary);
    }

    @Test
    void uploadShouldAcceptFileJustUnderConfiguredLimit() throws Exception {
        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(Map.of(
                "secure_url", "https://res.cloudinary.com/demo/image/upload/v1/catalog/demo.jpg"
        ));

        CloudinaryUploadService service = new CloudinaryUploadService(
                cloudinary,
                new CloudinaryProperties("demo-cloud", "demo-key", "demo-secret", "ecommerce"),
                new DemoProperties(false, "https://example.com/demo-image.jpg", "https://example.com/demo-video.mp4"),
                uploadProperties
        );

        byte[] payload = new byte[(MAX_UPLOAD_MB * 1024 * 1024) - 1];
        UploadResponse response = service.upload(new MockMultipartFile(
                "file",
                "demo.jpg",
                "image/jpeg",
                payload
        ));

        assertEquals("IMAGE", response.mediaType());
        assertEquals("image", response.type());
        assertFalse(response.demoMode());
        assertNotNull(response.secureUrl());
        verify(uploader).upload(any(byte[].class), any(Map.class));
    }

    @Test
    void uploadShouldRejectFileAboveConfiguredLimit() {
        CloudinaryUploadService service = new CloudinaryUploadService(
                cloudinary,
                new CloudinaryProperties("demo-cloud", "demo-key", "demo-secret", "ecommerce"),
                new DemoProperties(false, "https://example.com/demo-image.jpg", "https://example.com/demo-video.mp4"),
                uploadProperties
        );

        byte[] payload = new byte[(MAX_UPLOAD_MB * 1024 * 1024) + 1];
        BadRequestException exception = assertThrows(BadRequestException.class, () -> service.upload(new MockMultipartFile(
                "file",
                "oversized.mp4",
                "video/mp4",
                payload
        )));

        assertEquals("File exceeds maximum allowed size of 200 MB", exception.getMessage());
        verifyNoInteractions(cloudinary);
    }
}
