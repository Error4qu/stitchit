package com.stitchit.dto;

import com.stitchit.entity.AlterationStatus;
import com.stitchit.entity.SlotTime;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AlterationOrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long tailorId;
    private String tailorName;
    private AddressResponse address;
    private LocalDate scheduledDate;
    private SlotTime scheduledSlot;
    private String scheduledSlotDisplay;
    private AlterationStatus status;
    private List<AlterationOrderItemResponse> items;
    private String tailorNotes;
    private String specialInstructions;
    private List<String> beforePhotos;
    private List<String> afterPhotos;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Long getTailorId() { return tailorId; }
    public void setTailorId(Long tailorId) { this.tailorId = tailorId; }
    public String getTailorName() { return tailorName; }
    public void setTailorName(String tailorName) { this.tailorName = tailorName; }
    public AddressResponse getAddress() { return address; }
    public void setAddress(AddressResponse address) { this.address = address; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public SlotTime getScheduledSlot() { return scheduledSlot; }
    public void setScheduledSlot(SlotTime scheduledSlot) { this.scheduledSlot = scheduledSlot; }
    public String getScheduledSlotDisplay() { return scheduledSlotDisplay; }
    public void setScheduledSlotDisplay(String scheduledSlotDisplay) { this.scheduledSlotDisplay = scheduledSlotDisplay; }
    public AlterationStatus getStatus() { return status; }
    public void setStatus(AlterationStatus status) { this.status = status; }
    public List<AlterationOrderItemResponse> getItems() { return items; }
    public void setItems(List<AlterationOrderItemResponse> items) { this.items = items; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
