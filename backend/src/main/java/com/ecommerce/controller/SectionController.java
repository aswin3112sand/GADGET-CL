package com.ecommerce.controller;

import com.ecommerce.dto.SectionRequest;
import com.ecommerce.dto.SectionResponse;
import com.ecommerce.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @GetMapping("/sections")
    public ResponseEntity<List<SectionResponse>> getSections() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofSeconds(30)).cachePublic())
                .header("CDN-Cache-Control", "public, max-age=30")
                .body(sectionService.getAllSections());
    }

    @PostMapping("/admin/sections")
    public ResponseEntity<SectionResponse> createSection(@Valid @RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.createSection(request));
    }

    @PutMapping("/admin/sections/{id}")
    public ResponseEntity<SectionResponse> updateSection(@PathVariable Long id, @Valid @RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(id, request));
    }

    @DeleteMapping("/admin/sections/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
