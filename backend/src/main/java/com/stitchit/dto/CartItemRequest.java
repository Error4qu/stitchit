package com.stitchit.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {
    @NotNull(message = "Fabric ID is required")
    private Long fabricId;

    @NotNull(message = "Style ID is required")
    private Long styleId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    private String customizations;

    public CartItemRequest() {}

    public CartItemRequest(Long fabricId, Long styleId, int quantity, String customizations) {
        this.fabricId = fabricId;
        this.styleId = styleId;
        this.quantity = quantity;
        this.customizations = customizations;
    }

    public Long getFabricId() { return fabricId; }
    public void setFabricId(Long fabricId) { this.fabricId = fabricId; }
    public Long getStyleId() { return styleId; }
    public void setStyleId(Long styleId) { this.styleId = styleId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }
}
