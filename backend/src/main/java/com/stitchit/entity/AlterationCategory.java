package com.stitchit.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "alteration_categories")
public class AlterationCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private AlterationCategoryType type;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String icon;

    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<AlterationService> services;

    public AlterationCategory() {}

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
    public List<AlterationService> getServices() { return services; }
    public void setServices(List<AlterationService> services) { this.services = services; }
}
