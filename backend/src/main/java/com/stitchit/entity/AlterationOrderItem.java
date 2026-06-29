package com.stitchit.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "alteration_order_items")
public class AlterationOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alteration_order_id", nullable = false)
    private AlterationOrder alterationOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "alteration_service_id", nullable = false)
    private AlterationService alterationService;

    @Column(name = "garment_description", length = 500)
    private String garmentDescription;

    @Column(name = "customer_notes", length = 500)
    private String customerNotes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public AlterationOrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AlterationOrder getAlterationOrder() { return alterationOrder; }
    public void setAlterationOrder(AlterationOrder alterationOrder) { this.alterationOrder = alterationOrder; }
    public AlterationService getAlterationService() { return alterationService; }
    public void setAlterationService(AlterationService alterationService) { this.alterationService = alterationService; }
    public String getGarmentDescription() { return garmentDescription; }
    public void setGarmentDescription(String garmentDescription) { this.garmentDescription = garmentDescription; }
    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
