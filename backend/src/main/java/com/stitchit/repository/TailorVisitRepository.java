package com.stitchit.repository;

import com.stitchit.entity.TailorVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TailorVisitRepository extends JpaRepository<TailorVisit, Long> {
    List<TailorVisit> findByOrderId(Long orderId);
    List<TailorVisit> findByTailorId(Long tailorId);
}
