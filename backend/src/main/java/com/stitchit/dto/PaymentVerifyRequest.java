package com.stitchit.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerifyRequest {

    @NotBlank(message = "Provider order id is required")
    private String providerOrderId;

    @NotBlank(message = "Provider payment id is required")
    private String providerPaymentId;

    @NotBlank(message = "Signature is required")
    private String signature;

    public String getProviderOrderId() { return providerOrderId; }
    public void setProviderOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; }
    public String getProviderPaymentId() { return providerPaymentId; }
    public void setProviderPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}
