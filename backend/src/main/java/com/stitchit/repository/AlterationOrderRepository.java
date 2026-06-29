package com.stitchit.repository;

import com.stitchit.entity.AlterationOrder;
import com.stitchit.entity.AlterationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlterationOrderRepository extends JpaRepository<AlterationOrder, Long> {
    Page<AlterationOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    Page<AlterationOrder> findByTailorIdOrderByScheduledDateAsc(Long tailorId, Pageable pageable);
    Page<AlterationOrder> findByStatusOrderByCreatedAtDesc(AlterationStatus status, Pageable pageable);
    List<AlterationOrder> findByTailorIdAndStatusNotOrderByScheduledDateAsc(Long tailorId, AlterationStatus status);
}
