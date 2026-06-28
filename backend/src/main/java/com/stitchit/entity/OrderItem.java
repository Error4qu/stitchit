package com.stitchit.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String customizations;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id", nullable = false)
    private Style style;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fabric_id", nullable = false)
    private Fabric fabric;

    public OrderItem() {}

    public OrderItem(Long id, int quantity, BigDecimal price, String customizations) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.customizations = customizations;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Style getStyle() { return style; }
    public void setStyle(Style style) { this.style = style; }
    public Fabric getFabric() { return fabric; }
    public void setFabric(Fabric fabric) { this.fabric = fabric; }
}
