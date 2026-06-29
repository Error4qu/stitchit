package com.stitchit.dto;

import com.stitchit.entity.SlotTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class AlterationOrderRequest {

    @NotNull(message = "Address is required")
    private Long addressId;

    @NotNull(message = "Scheduled date is required")
    @Future(message = "Scheduled date must be in the future")
    private LocalDate scheduledDate;

    @NotNull(message = "Time slot is required")
    private SlotTime scheduledSlot;

    @NotEmpty(message = "At least one service must be selected")
    @Valid
    private List<AlterationOrderItemRequest> items;

    @Size(max = 1000, message = "Special instructions cannot exceed 1000 characters")
    private String specialInstructions;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public SlotTime getScheduledSlot() { return scheduledSlot; }
    public void setScheduledSlot(SlotTime scheduledSlot) { this.scheduledSlot = scheduledSlot; }
    public List<AlterationOrderItemRequest> getItems() { return items; }
    public void setItems(List<AlterationOrderItemRequest> items) { this.items = items; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
