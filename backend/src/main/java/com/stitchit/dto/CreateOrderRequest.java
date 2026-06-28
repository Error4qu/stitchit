package com.stitchit.dto;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {
    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long shippingAddressId) {
        this.shippingAddressId = shippingAddressId;
    }

    public Long getShippingAddressId() { return shippingAddressId; }
    public void setShippingAddressId(Long shippingAddressId) { this.shippingAddressId = shippingAddressId; }
}
