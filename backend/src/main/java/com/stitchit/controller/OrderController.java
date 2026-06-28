package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.CreateOrderRequest;
import com.stitchit.dto.OrderResponse;
import com.stitchit.entity.OrderStatus;
import com.stitchit.security.UserPrincipal;
import com.stitchit.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        Long userId = getUserId(authentication);
        OrderResponse order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order created successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(Authentication authentication) {
        Long userId = getUserId(authentication);
        List<OrderResponse> orders = orderService.getOrdersForUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders fetched successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            Authentication authentication, @PathVariable Long id) {
        Long userId = getUserId(authentication);
        OrderResponse order = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order fetched successfully", order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            Authentication authentication, @PathVariable Long id, @RequestParam OrderStatus status) {
        // In full app verify admin/tailor role
        OrderResponse order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated successfully", order));
    }

    private Long getUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new org.springframework.security.access.AccessDeniedException("User not authenticated");
        }
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }
}
