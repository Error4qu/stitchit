package com.stitchit.dto;

import java.math.BigDecimal;

public class FabricResponse {
    private Long id;
    private String name;
    private String type;
    private String description;
    private BigDecimal pricePerMeter;
    private String imageUrl;
    private boolean inStock;
    private String color;
    private String material;

    public FabricResponse() {}

    public FabricResponse(Long id, String name, String type, String description,
                          BigDecimal pricePerMeter, String imageUrl, boolean inStock,
                          String color, String material) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.pricePerMeter = pricePerMeter;
        this.imageUrl = imageUrl;
        this.inStock = inStock;
        this.color = color;
        this.material = material;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPricePerMeter() { return pricePerMeter; }
    public void setPricePerMeter(BigDecimal pricePerMeter) { this.pricePerMeter = pricePerMeter; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
}
