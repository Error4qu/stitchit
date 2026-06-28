package com.stitchit.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int quantity;

    @Column(columnDefinition = "TEXT")
    private String customizations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fabric_id", nullable = false)
    private Fabric fabric;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id", nullable = false)
    private Style style;

    public CartItem() {}

    public CartItem(Long id, Long userId, int quantity, String customizations) {
        this.id = id;
        this.userId = userId;
        this.quantity = quantity;
        this.customizations = customizations;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }
    public Fabric getFabric() { return fabric; }
    public void setFabric(Fabric fabric) { this.fabric = fabric; }
    public Style getStyle() { return style; }
    public void setStyle(Style style) { this.style = style; }
}
