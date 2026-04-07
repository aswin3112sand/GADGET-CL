package com.ecommerce.service;

import com.ecommerce.dto.SectionRequest;
import com.ecommerce.dto.SectionResponse;
import com.ecommerce.entity.Section;
import com.ecommerce.exception.NotFoundException;
import com.ecommerce.exception.ResourceAlreadyExistsException;
import com.ecommerce.exception.ResourceConflictException;
import com.ecommerce.mapper.SectionMapper;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;
    private final ProductRepository productRepository;
    private final SectionMapper sectionMapper;

    @Transactional(readOnly = true)
    public List<SectionResponse> getAllSections() {
        Map<Long, Long> productCounts = productRepository.countProductsBySection()
                .stream()
                .collect(Collectors.toMap(
                        ProductRepository.SectionProductCount::getSectionId,
                        ProductRepository.SectionProductCount::getProductCount
                ));

        return sectionRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(section -> sectionMapper.toResponse(section, productCounts.getOrDefault(section.getId(), 0L)))
                .toList();
    }

    @Transactional
    public SectionResponse createSection(SectionRequest request) {
        String name = request.name().trim();
        if (sectionRepository.existsByNameIgnoreCase(name)) {
            throw new ResourceAlreadyExistsException("Section already exists with name " + name);
        }
        Section section = Section.builder().name(name).build();
        return sectionMapper.toResponse(sectionRepository.save(section), 0);
    }

    @Transactional
    public SectionResponse updateSection(Long id, SectionRequest request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Section not found with id " + id));
        String name = request.name().trim();
        if (sectionRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ResourceAlreadyExistsException("Section already exists with name " + name);
        }
        section.setName(name);
        return sectionMapper.toResponse(section, productRepository.countBySectionId(id));
    }

    @Transactional
    public void deleteSection(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Section not found with id " + id));
        long linkedProducts = productRepository.countBySectionId(id);
        if (linkedProducts > 0) {
            throw new ResourceConflictException("This section still contains " + linkedProducts + " product(s). Move or update those products before deleting the section.");
        }
        sectionRepository.delete(section);
    }
}
