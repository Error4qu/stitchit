package com.stitchit.dto;

import com.stitchit.entity.AlterationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateAlterationStatusRequest {

    @NotNull(message = "Status is required")
    private AlterationStatus status;

    private String tailorNotes;

    public AlterationStatus getStatus() { return status; }
    public void setStatus(AlterationStatus status) { this.status = status; }
    public String getTailorNotes() { return tailorNotes; }
    public void setTailorNotes(String tailorNotes) { this.tailorNotes = tailorNotes; }
}
