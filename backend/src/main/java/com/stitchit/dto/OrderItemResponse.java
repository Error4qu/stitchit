package com.stitchit.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private int quantity;
    private BigDecimal price;
    private String customizations;
    private FabricResponse fabric;
    private StyleResponse style;

    public OrderItemResponse() {}

    public OrderItemResponse(Long id, int quantity, BigDecimal price, String customizations,
                             FabricResponse fabric, StyleResponse style) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.customizations = customizations;
        this.fabric = fabric;
        this.style = style;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }
    public FabricResponse getFabric() { return fabric; }
    public void setFabric(FabricResponse fabric) { this.fabric = fabric; }
    public StyleResponse getStyle() { return style; }
    public void setStyle(StyleResponse style) { this.style = style; }
}
