package com.stitchit.service;

import com.stitchit.dto.PaymentCheckoutResponse;
import com.stitchit.dto.PaymentVerifyRequest;
import com.stitchit.entity.*;
import com.stitchit.payment.PaymentProvider;
import com.stitchit.repository.AlterationOrderRepository;
import com.stitchit.repository.PaymentRepository;
import com.stitchit.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final AlterationOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentProvider paymentProvider;

    public PaymentService(PaymentRepository paymentRepository,
                          AlterationOrderRepository orderRepository,
                          UserRepository userRepository,
                          PaymentProvider paymentProvider) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.paymentProvider = paymentProvider;
    }

    @Transactional
    public PaymentCheckoutResponse createCheckout(Long alterationOrderId, String userEmail) {
        AlterationOrder order = orderRepository.findById(alterationOrderId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Alteration order not found: " + alterationOrderId));

        User user = findUser(userEmail);
        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Order does not belong to this customer");
        }
        if (order.getPaymentStatus() == OrderPaymentStatus.PAID) {
            throw new IllegalStateException("Order is already paid");
        }

        // Reuse an open checkout if one exists so retries don't pile up provider orders
        Payment payment = paymentRepository
                .findFirstByAlterationOrderIdAndStatusOrderByIdDesc(order.getId(), PaymentStatus.CREATED)
                .orElseGet(() -> {
                    String providerOrderId = paymentProvider.createProviderOrder(
                            order.getTotalPrice(), "INR", "alteration-" + order.getId());
                    Payment p = new Payment();
                    p.setAlterationOrder(order);
                    p.setProvider(paymentProvider.name());
                    p.setProviderOrderId(providerOrderId);
                    p.setAmount(order.getTotalPrice());
                    p.setCurrency("INR");
                    p.setStatus(PaymentStatus.CREATED);
                    return paymentRepository.save(p);
                });

        return new PaymentCheckoutResponse(
                payment.getId(), order.getId(), payment.getProvider(),
                payment.getProviderOrderId(), paymentProvider.publicKeyId(),
                payment.getAmount(), payment.getCurrency());
    }

    @Transactional
    public PaymentCheckoutResponse verifyPayment(PaymentVerifyRequest request, String userEmail) {
        Payment payment = paymentRepository.findByProviderOrderId(request.getProviderOrderId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Payment not found for order: " + request.getProviderOrderId()));

        User user = findUser(userEmail);
        AlterationOrder order = payment.getAlterationOrder();
        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Payment does not belong to this customer");
        }

        // Idempotent: re-verifying an already-paid payment succeeds quietly
        if (payment.getStatus() == PaymentStatus.PAID) {
            return toResponse(payment, order);
        }

        if (!paymentProvider.verifySignature(request.getProviderOrderId(),
                request.getProviderPaymentId(), request.getSignature())) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            log.warn("PAYMENT_VERIFY_FAILED orderId={} providerOrderId={}",
                    order.getId(), request.getProviderOrderId());
            throw new IllegalArgumentException("Payment signature verification failed");
        }

        payment.setProviderPaymentId(request.getProviderPaymentId());
        payment.setStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);

        order.setPaymentStatus(OrderPaymentStatus.PAID);
        orderRepository.save(order);

        log.info("PAYMENT_CONFIRMED orderId={} paymentId={} amount={}",
                order.getId(), payment.getId(), payment.getAmount());
        return toResponse(payment, order);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private PaymentCheckoutResponse toResponse(Payment payment, AlterationOrder order) {
        return new PaymentCheckoutResponse(
                payment.getId(), order.getId(), payment.getProvider(),
                payment.getProviderOrderId(), paymentProvider.publicKeyId(),
                payment.getAmount(), payment.getCurrency());
    }
}
