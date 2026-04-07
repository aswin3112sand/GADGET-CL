package com.ecommerce.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductMediaSerializer {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public List<String> fromJson(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }

        try {
            List<String> urls = objectMapper.readValue(value, STRING_LIST);
            return sanitize(urls);
        } catch (JsonProcessingException exception) {
            log.warn("Unable to parse product image urls JSON, returning an empty list", exception);
            return List.of();
        }
    }

    public String toJson(List<String> urls) {
        try {
            return objectMapper.writeValueAsString(sanitize(urls));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize product image urls", exception);
        }
    }

    private List<String> sanitize(List<String> urls) {
        if (urls == null || urls.isEmpty()) {
            return List.of();
        }

        return new ArrayList<>(new LinkedHashSet<>(
                urls.stream()
                        .filter(url -> url != null && !url.isBlank())
                        .map(String::trim)
                        .toList()
        ));
    }
}
