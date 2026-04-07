package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    interface SectionProductCount {
        Long getSectionId();

        long getProductCount();
    }

    @Override
    @EntityGraph(attributePaths = {"section", "mediaItems"})
    List<Product> findAll();

    @Override
    @EntityGraph(attributePaths = {"section", "mediaItems"})
    Optional<Product> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p left join fetch p.section where p.id in :ids")
    List<Product> findAllByIdInForUpdate(@Param("ids") List<Long> ids);

    long countBySectionId(Long sectionId);

    @Query("select p.section.id as sectionId, count(p.id) as productCount from Product p group by p.section.id")
    List<SectionProductCount> countProductsBySection();
}
