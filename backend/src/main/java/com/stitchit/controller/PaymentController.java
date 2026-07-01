package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.PaymentCheckoutRequest;
import com.stitchit.dto.PaymentCheckoutResponse;
import com.stitchit.dto.PaymentVerifyRequest;
import com.stitchit.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@PreAuthorize("hasRole('CUSTOMER')")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<PaymentCheckoutResponse>> createCheckout(
            @Valid @RequestBody PaymentCheckoutRequest request,
            Authentication authentication) {
        PaymentCheckoutResponse checkout = paymentService.createCheckout(
                request.getAlterationOrderId(), authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Checkout created", checkout));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentCheckoutResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request,
            Authentication authentication) {
        PaymentCheckoutResponse payment = paymentService.verifyPayment(
                request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Payment confirmed", payment));
    }
}
