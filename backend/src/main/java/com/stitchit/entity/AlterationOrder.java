package com.stitchit.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alteration_orders")
public class AlterationOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tailor_id")
    private User tailor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "scheduled_slot", nullable = false)
    private SlotTime scheduledSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlterationStatus status = AlterationStatus.BOOKED;

    @OneToMany(mappedBy = "alterationOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<AlterationOrderItem> items = new ArrayList<>();

    @Column(name = "tailor_notes", length = 1000)
    private String tailorNotes;

    @Column(name = "special_instructions", length = 1000)
    private String specialInstructions;

    @ElementCollection
    @CollectionTable(name = "alteration_order_before_photos", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "photo_url", length = 500)
    private List<String> beforePhotos = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "alteration_order_after_photos", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "photo_url", length = 500)
    private List<String> afterPhotos = new ArrayList<>();

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Optimistic lock — concurrent status updates fail with 409 instead of silently overwriting
    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = AlterationStatus.BOOKED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public User getTailor() { return tailor; }
    public void setTailor(User tailor) { this.tailor = tailor; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public SlotTime getScheduledSlot() { return scheduledSlot; }
    public void setScheduledSlot(SlotTime scheduledSlot) { this.scheduledSlot = scheduledSlot; }
    public AlterationStatus getStatus() { return status; }
    public void setStatus(AlterationStatus status) { this.status = status; }
    public List<AlterationOrderItem> getItems() { return items; }
    public void setItems(List<AlterationOrderItem> items) { this.items = items; }
    public String getTailorNotes() { return tailorNotes; }
    public void setTailorNotes(String tailorNotes) { this.tailorNotes = tailorNotes; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public List<String> getBeforePhotos() { return beforePhotos; }
    public void setBeforePhotos(List<String> beforePhotos) { this.beforePhotos = beforePhotos; }
    public List<String> getAfterPhotos() { return afterPhotos; }
    public void setAfterPhotos(List<String> afterPhotos) { this.afterPhotos = afterPhotos; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
