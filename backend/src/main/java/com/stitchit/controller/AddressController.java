package com.stitchit.controller;

import com.stitchit.dto.AddressRequest;
import com.stitchit.dto.AddressResponse;
import com.stitchit.dto.ApiResponse;
import com.stitchit.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses(Authentication authentication) {
        List<AddressResponse> addresses = addressService.getMyAddresses(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Addresses fetched", addresses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {
        AddressResponse address = addressService.createAddress(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Address created", address));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {
        AddressResponse address = addressService.updateAddress(addressId, request, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Address updated", address));
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long addressId,
            Authentication authentication) {
        AddressResponse address = addressService.setDefaultAddress(addressId, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Default address updated", address));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long addressId,
            Authentication authentication) {
        addressService.deleteAddress(addressId, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Address deleted", null));
    }
}
