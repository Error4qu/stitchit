package com.stitchit.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customization_options")
public class CustomizationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String choices;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id", nullable = false)
    private Style style;

    public CustomizationOption() {}

    public CustomizationOption(Long id, String name, String type, String choices) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.choices = choices;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getChoices() { return choices; }
    public void setChoices(String choices) { this.choices = choices; }
    public Style getStyle() { return style; }
    public void setStyle(Style style) { this.style = style; }
}
