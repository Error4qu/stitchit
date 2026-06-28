package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.FabricResponse;
import com.stitchit.dto.StyleResponse;
import com.stitchit.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/fabrics")
    public ResponseEntity<ApiResponse<List<FabricResponse>>> getFabrics(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String name) {
        List<FabricResponse> fabrics = catalogService.getAllFabrics(type, name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fabrics fetched successfully", fabrics));
    }

    @GetMapping("/fabrics/{id}")
    public ResponseEntity<ApiResponse<FabricResponse>> getFabricById(@PathVariable Long id) {
        FabricResponse fabric = catalogService.getFabricById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fabric fetched successfully", fabric));
    }

    @GetMapping("/styles")
    public ResponseEntity<ApiResponse<List<StyleResponse>>> getStyles(
            @RequestParam(required = false) String category) {
        List<StyleResponse> styles = catalogService.getAllStyles(category);
        return ResponseEntity.ok(new ApiResponse<>(true, "Styles fetched successfully", styles));
    }

    @GetMapping("/styles/{id}")
    public ResponseEntity<ApiResponse<StyleResponse>> getStyleById(@PathVariable Long id) {
        StyleResponse style = catalogService.getStyleById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Style fetched successfully", style));
    }
}
