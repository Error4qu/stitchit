package com.stitchit.repository;

import com.stitchit.entity.AlterationService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlterationServiceRepository extends JpaRepository<AlterationService, Long> {
    List<AlterationService> findByCategoryId(Long categoryId);

    @Query("SELECT s FROM AlterationService s JOIN FETCH s.category WHERE s.category.id = :categoryId")
    List<AlterationService> findByCategoryIdWithCategory(@Param("categoryId") Long categoryId);
}
