package com.stitchit.dto;

import java.math.BigDecimal;

public class AlterationServiceResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer estimatedDays;
    private Long categoryId;
    private String categoryDisplayName;
    private String icon;

    public AlterationServiceResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public Integer getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(Integer estimatedDays) { this.estimatedDays = estimatedDays; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryDisplayName() { return categoryDisplayName; }
    public void setCategoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
