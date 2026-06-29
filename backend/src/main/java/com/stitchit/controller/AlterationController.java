package com.stitchit.controller;

import com.stitchit.dto.*;
import com.stitchit.service.AlterationOrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alterations")
public class AlterationController {

    private final AlterationOrderService alterationOrderService;

    public AlterationController(AlterationOrderService alterationOrderService) {
        this.alterationOrderService = alterationOrderService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<AlterationCategoryResponse>>> getCategories() {
        List<AlterationCategoryResponse> categories = alterationOrderService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "Categories fetched", categories));
    }

    @GetMapping("/categories/{categoryId}/services")
    public ResponseEntity<ApiResponse<List<AlterationServiceResponse>>> getServicesByCategory(
            @PathVariable Long categoryId) {
        List<AlterationServiceResponse> services = alterationOrderService.getServicesByCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Services fetched", services));
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<AlterationOrderResponse>> createOrder(
            @Valid @RequestBody AlterationOrderRequest request,
            Authentication authentication) {
        AlterationOrderResponse order = alterationOrderService.createOrder(request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Alteration order created", order));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Page<AlterationOrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Page<AlterationOrderResponse> orders = alterationOrderService.getCustomerOrders(
                authentication.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders fetched", orders));
    }

    @GetMapping("/orders/tailor")
    @PreAuthorize("hasRole('TAILOR')")
    public ResponseEntity<ApiResponse<Page<AlterationOrderResponse>>> getTailorOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Page<AlterationOrderResponse> orders = alterationOrderService.getTailorOrders(
                authentication.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tailor orders fetched", orders));
    }

    @GetMapping("/orders/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AlterationOrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AlterationOrderResponse> orders = alterationOrderService.getAllOrders(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "All orders fetched", orders));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<AlterationOrderResponse>> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        AlterationOrderResponse order = alterationOrderService.getOrderById(orderId, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Order fetched", order));
    }

    @PatchMapping("/orders/{orderId}/status")
    @PreAuthorize("hasRole('TAILOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AlterationOrderResponse>> updateStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateAlterationStatusRequest request,
            Authentication authentication) {
        AlterationOrderResponse order = alterationOrderService.updateStatus(
                orderId, request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated", order));
    }

    @PostMapping("/orders/{orderId}/photos")
    @PreAuthorize("hasRole('TAILOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AlterationOrderResponse>> uploadPhotos(
            @PathVariable Long orderId,
            @Valid @RequestBody UploadPhotosRequest request,
            Authentication authentication) {
        AlterationOrderResponse order = alterationOrderService.uploadPhotos(
                orderId, request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Photos uploaded", order));
    }

    @PostMapping("/orders/{orderId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AlterationOrderResponse>> assignTailor(
            @PathVariable Long orderId,
            @RequestParam Long tailorId) {
        AlterationOrderResponse order = alterationOrderService.assignTailor(orderId, tailorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tailor assigned", order));
    }
}
