package com.stitchit.repository;

import com.stitchit.entity.AlterationOrder;
import com.stitchit.entity.AlterationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AlterationOrderRepository extends JpaRepository<AlterationOrder, Long> {

    /** Projection for GROUP BY status aggregation. */
    interface StatusCount {
        AlterationStatus getStatus();
        long getCount();
    }

    @EntityGraph(attributePaths = {"customer", "tailor", "address"})
    Page<AlterationOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "tailor", "address"})
    Page<AlterationOrder> findByTailorIdOrderByScheduledDateAsc(Long tailorId, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "tailor", "address"})
    Page<AlterationOrder> findByStatusOrderByCreatedAtDesc(AlterationStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "tailor", "address"})
    Page<AlterationOrder> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<AlterationOrder> findByTailorIdAndStatusNotOrderByScheduledDateAsc(Long tailorId, AlterationStatus status);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM AlterationOrder o WHERE o.status = :status")
    BigDecimal sumTotalPriceByStatus(@Param("status") AlterationStatus status);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM AlterationOrder o WHERE o.status <> :status")
    BigDecimal sumTotalPriceByStatusNot(@Param("status") AlterationStatus status);

    @Query("SELECT o.status AS status, COUNT(o) AS count FROM AlterationOrder o GROUP BY o.status")
    List<StatusCount> countGroupedByStatus();
}
