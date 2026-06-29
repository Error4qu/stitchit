package com.stitchit.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class UploadPhotosRequest {

    @NotNull(message = "Photo type is required (BEFORE or AFTER)")
    private String photoType;

    @NotEmpty(message = "At least one photo URL is required")
    @Size(max = 3, message = "Maximum 3 photos allowed")
    private List<String> photoUrls;

    public String getPhotoType() { return photoType; }
    public void setPhotoType(String photoType) { this.photoType = photoType; }
    public List<String> getPhotoUrls() { return photoUrls; }
    public void setPhotoUrls(List<String> photoUrls) { this.photoUrls = photoUrls; }
}
