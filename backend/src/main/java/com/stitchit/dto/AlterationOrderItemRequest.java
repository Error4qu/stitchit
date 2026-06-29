package com.stitchit.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AlterationOrderItemRequest {

    @NotNull(message = "Alteration service ID is required")
    private Long alterationServiceId;

    @Size(max = 500, message = "Garment description cannot exceed 500 characters")
    private String garmentDescription;

    @Size(max = 500, message = "Customer notes cannot exceed 500 characters")
    private String customerNotes;

    public Long getAlterationServiceId() { return alterationServiceId; }
    public void setAlterationServiceId(Long alterationServiceId) { this.alterationServiceId = alterationServiceId; }
    public String getGarmentDescription() { return garmentDescription; }
    public void setGarmentDescription(String garmentDescription) { this.garmentDescription = garmentDescription; }
    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }
}
