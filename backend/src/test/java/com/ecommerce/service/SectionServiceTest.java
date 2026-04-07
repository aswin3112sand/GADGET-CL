package com.ecommerce.service;

import com.ecommerce.dto.SectionRequest;
import com.ecommerce.dto.SectionResponse;
import com.ecommerce.entity.Section;
import com.ecommerce.exception.ResourceAlreadyExistsException;
import com.ecommerce.exception.ResourceConflictException;
import com.ecommerce.mapper.SectionMapper;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.SectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SectionServiceTest {

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private ProductRepository productRepository;

    private SectionService sectionService;

    @BeforeEach
    void setUp() {
        sectionService = new SectionService(sectionRepository, productRepository, new SectionMapper());
    }

    @Test
    void getAllSectionsShouldIncludeProductCounts() {
        Section accessories = Section.builder().id(1L).name("Accessories").build();
        Section phones = Section.builder().id(2L).name("Phones").build();

        when(sectionRepository.findAll(any(Sort.class))).thenReturn(List.of(accessories, phones));
        when(productRepository.countProductsBySection()).thenReturn(List.of(sectionCount(1L, 3L)));

        List<SectionResponse> responses = sectionService.getAllSections();

        assertEquals(2, responses.size());
        assertEquals(3L, responses.get(0).productCount());
        assertEquals(0L, responses.get(1).productCount());
    }

    @Test
    void createSectionShouldRejectDuplicateName() {
        when(sectionRepository.existsByNameIgnoreCase("Phones")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> sectionService.createSection(new SectionRequest(" Phones ")));
    }

    @Test
    void deleteSectionShouldRejectWhenProductsStillUseIt() {
        Section section = Section.builder().id(5L).name("Audio").build();
        when(sectionRepository.findById(5L)).thenReturn(Optional.of(section));
        when(productRepository.countBySectionId(5L)).thenReturn(2L);

        ResourceConflictException exception = assertThrows(ResourceConflictException.class, () -> sectionService.deleteSection(5L));

        assertEquals("This section still contains 2 product(s). Move or update those products before deleting the section.", exception.getMessage());
        verify(sectionRepository, never()).delete(section);
    }

    private ProductRepository.SectionProductCount sectionCount(Long sectionId, long productCount) {
        return new ProductRepository.SectionProductCount() {
            @Override
            public Long getSectionId() {
                return sectionId;
            }

            @Override
            public long getProductCount() {
                return productCount;
            }
        };
    }
}
