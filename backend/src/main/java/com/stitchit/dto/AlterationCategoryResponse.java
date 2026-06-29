package com.stitchit.dto;

import com.stitchit.entity.AlterationCategoryType;

public class AlterationCategoryResponse {
    private Long id;
    private AlterationCategoryType type;
    private String displayName;
    private String icon;
    private String description;
    private Integer sortOrder;
    private int serviceCount;

    public AlterationCategoryResponse() {}

    public AlterationCategoryResponse(Long id, AlterationCategoryType type, String displayName,
                                      String icon, String description, Integer sortOrder, int serviceCount) {
        this.id = id;
        this.type = type;
        this.displayName = displayName;
        this.icon = icon;
        this.description = description;
        this.sortOrder = sortOrder;
        this.serviceCount = serviceCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AlterationCategoryType getType() { return type; }
    public void setType(AlterationCategoryType type) { this.type = type; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public int getServiceCount() { return serviceCount; }
    public void setServiceCount(int serviceCount) { this.serviceCount = serviceCount; }
}
