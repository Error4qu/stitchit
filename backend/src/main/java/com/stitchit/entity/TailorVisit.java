package com.stitchit.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tailor_visits")
public class TailorVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @Column(name = "actual_visit_date")
    private LocalDateTime actualVisitDate;

    @Column(nullable = false)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tailor_id", nullable = false)
    private User tailor;

    public TailorVisit() {}

    public TailorVisit(Long id, LocalDateTime scheduledDate, LocalDateTime actualVisitDate,
                       String status, String notes) {
        this.id = id;
        this.scheduledDate = scheduledDate;
        this.actualVisitDate = actualVisitDate;
        this.status = status;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    public LocalDateTime getActualVisitDate() { return actualVisitDate; }
    public void setActualVisitDate(LocalDateTime actualVisitDate) { this.actualVisitDate = actualVisitDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public User getTailor() { return tailor; }
    public void setTailor(User tailor) { this.tailor = tailor; }
}
