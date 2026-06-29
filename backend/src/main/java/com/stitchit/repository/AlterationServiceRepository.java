package com.stitchit.repository;

import com.stitchit.entity.AlterationService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlterationServiceRepository extends JpaRepository<AlterationService, Long> {
    List<AlterationService> findByCategoryId(Long categoryId);
}
