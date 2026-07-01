package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.RevenueSummaryResponse;
import com.stitchit.dto.UserResponse;
import com.stitchit.entity.Role;
import com.stitchit.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<UserResponse> users = adminService.getUsers(role, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched", users));
    }

    @GetMapping("/alterations/revenue-summary")
    public ResponseEntity<ApiResponse<RevenueSummaryResponse>> getRevenueSummary() {
        RevenueSummaryResponse summary = adminService.getRevenueSummary();
        return ResponseEntity.ok(new ApiResponse<>(true, "Revenue summary fetched", summary));
    }
}
