package com.stitchit.repository;

import com.stitchit.entity.Payment;
import com.stitchit.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findFirstByAlterationOrderIdAndStatusOrderByIdDesc(Long orderId, PaymentStatus status);
}
