package com.stitchit.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tailor_rating", nullable = false)
    private int tailorRating;

    @Column(name = "garment_rating", nullable = false)
    private int garmentRating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Review() {}

    public Review(Long id, int tailorRating, int garmentRating, String comment) {
        this.id = id;
        this.tailorRating = tailorRating;
        this.garmentRating = garmentRating;
        this.comment = comment;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getTailorRating() { return tailorRating; }
    public void setTailorRating(int tailorRating) { this.tailorRating = tailorRating; }
    public int getGarmentRating() { return garmentRating; }
    public void setGarmentRating(int garmentRating) { this.garmentRating = garmentRating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
