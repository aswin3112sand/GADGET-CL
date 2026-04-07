package com.ecommerce.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.demo")
public record DemoProperties(
        boolean enabled,
        String sampleImageUrl,
        String sampleVideoUrl
) {
}
