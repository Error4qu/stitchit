package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.CartItemRequest;
import com.stitchit.dto.CartItemResponse;
import com.stitchit.security.UserPrincipal;
import com.stitchit.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(Authentication authentication) {
        Long userId = getUserId(authentication);
        List<CartItemResponse> cart = cartService.getCart(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart fetched successfully", cart));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemResponse>> addItem(
            Authentication authentication, @Valid @RequestBody CartItemRequest request) {
        Long userId = getUserId(authentication);
        CartItemResponse item = cartService.addItem(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Item added to cart", item));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateItem(
            Authentication authentication, @PathVariable Long id, @RequestParam int quantity) {
        Long userId = getUserId(authentication);
        CartItemResponse item = cartService.updateItem(userId, id, quantity);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart item updated", item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeItem(Authentication authentication, @PathVariable Long id) {
        Long userId = getUserId(authentication);
        cartService.removeItem(userId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart item removed", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        Long userId = getUserId(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart cleared", null));
    }

    private Long getUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new org.springframework.security.access.AccessDeniedException("User not authenticated");
        }
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }
}
