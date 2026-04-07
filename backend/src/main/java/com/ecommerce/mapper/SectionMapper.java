package com.ecommerce.mapper;

import com.ecommerce.dto.SectionResponse;
import com.ecommerce.entity.Section;
import org.springframework.stereotype.Component;

@Component
public class SectionMapper {

    public SectionResponse toResponse(Section section) {
        return toResponse(section, 0);
    }

    public SectionResponse toResponse(Section section, long productCount) {
        return new SectionResponse(section.getId(), section.getName(), productCount);
    }
}
