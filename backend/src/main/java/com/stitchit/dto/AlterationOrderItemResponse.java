package com.stitchit.dto;

import java.math.BigDecimal;

public class AlterationOrderItemResponse {
    private Long id;
    private Long alterationServiceId;
    private String alterationServiceName;
    private String alterationServiceIcon;
    private String garmentDescription;
    private String customerNotes;
    private BigDecimal price;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAlterationServiceId() { return alterationServiceId; }
    public void setAlterationServiceId(Long alterationServiceId) { this.alterationServiceId = alterationServiceId; }
    public String getAlterationServiceName() { return alterationServiceName; }
    public void setAlterationServiceName(String alterationServiceName) { this.alterationServiceName = alterationServiceName; }
    public String getAlterationServiceIcon() { return alterationServiceIcon; }
    public void setAlterationServiceIcon(String alterationServiceIcon) { this.alterationServiceIcon = alterationServiceIcon; }
    public String getGarmentDescription() { return garmentDescription; }
    public void setGarmentDescription(String garmentDescription) { this.garmentDescription = garmentDescription; }
    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
