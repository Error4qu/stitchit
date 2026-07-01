package com.stitchit.dto;

import jakarta.validation.constraints.NotNull;

public class PaymentCheckoutRequest {

    @NotNull(message = "Alteration order id is required")
    private Long alterationOrderId;

    public Long getAlterationOrderId() { return alterationOrderId; }
    public void setAlterationOrderId(Long alterationOrderId) { this.alterationOrderId = alterationOrderId; }
}
