package com.stitchit.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fabrics")
public class Fabric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_meter", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerMeter;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "in_stock")
    private boolean inStock;

    private String color;

    private String material;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Fabric() {}

    public Fabric(Long id, String name, String type, String description,
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

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
