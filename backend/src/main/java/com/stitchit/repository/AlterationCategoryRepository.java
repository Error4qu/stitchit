package com.stitchit.repository;

import com.stitchit.entity.AlterationCategory;
import com.stitchit.entity.AlterationCategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlterationCategoryRepository extends JpaRepository<AlterationCategory, Long> {
    List<AlterationCategory> findAllByOrderBySortOrderAsc();
    Optional<AlterationCategory> findByType(AlterationCategoryType type);
}
