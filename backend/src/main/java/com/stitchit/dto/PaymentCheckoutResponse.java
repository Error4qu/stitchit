package com.stitchit.dto;

import java.math.BigDecimal;

public class PaymentCheckoutResponse {
    private Long paymentId;
    private Long alterationOrderId;
    private String provider;
    private String providerOrderId;
    private String keyId;
    private BigDecimal amount;
    private String currency;

    public PaymentCheckoutResponse() {}

    public PaymentCheckoutResponse(Long paymentId, Long alterationOrderId, String provider,
                                   String providerOrderId, String keyId, BigDecimal amount,
                                   String currency) {
        this.paymentId = paymentId;
        this.alterationOrderId = alterationOrderId;
        this.provider = provider;
        this.providerOrderId = providerOrderId;
        this.keyId = keyId;
        this.amount = amount;
        this.currency = currency;
    }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    public Long getAlterationOrderId() { return alterationOrderId; }
    public void setAlterationOrderId(Long alterationOrderId) { this.alterationOrderId = alterationOrderId; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderOrderId() { return providerOrderId; }
    public void setProviderOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; }
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
