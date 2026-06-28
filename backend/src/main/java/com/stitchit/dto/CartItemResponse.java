package com.stitchit.dto;

public class CartItemResponse {
    private Long id;
    private Long userId;
    private int quantity;
    private String customizations;
    private FabricResponse fabric;
    private StyleResponse style;

    public CartItemResponse() {}

    public CartItemResponse(Long id, Long userId, int quantity, String customizations,
                            FabricResponse fabric, StyleResponse style) {
        this.id = id;
        this.userId = userId;
        this.quantity = quantity;
        this.customizations = customizations;
        this.fabric = fabric;
        this.style = style;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }
    public FabricResponse getFabric() { return fabric; }
    public void setFabric(FabricResponse fabric) { this.fabric = fabric; }
    public StyleResponse getStyle() { return style; }
    public void setStyle(StyleResponse style) { this.style = style; }
}
