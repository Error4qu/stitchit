package com.stitchit.service;

import com.stitchit.dto.CartItemRequest;
import com.stitchit.dto.CartItemResponse;
import com.stitchit.dto.FabricResponse;
import com.stitchit.dto.StyleResponse;
import com.stitchit.entity.CartItem;
import com.stitchit.entity.Fabric;
import com.stitchit.entity.Style;
import com.stitchit.repository.CartItemRepository;
import com.stitchit.repository.FabricRepository;
import com.stitchit.repository.StyleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final FabricRepository fabricRepository;
    private final StyleRepository styleRepository;

    public CartService(CartItemRepository cartItemRepository, FabricRepository fabricRepository, StyleRepository styleRepository) {
        this.cartItemRepository = cartItemRepository;
        this.fabricRepository = fabricRepository;
        this.styleRepository = styleRepository;
    }

    public List<CartItemResponse> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addItem(Long userId, CartItemRequest request) {
        Fabric fabric = fabricRepository.findById(request.getFabricId())
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Fabric not found"));
        Style style = styleRepository.findById(request.getStyleId())
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Style not found"));

        CartItem item = new CartItem();
        item.setUserId(userId);
        item.setFabric(fabric);
        item.setStyle(style);
        item.setQuantity(request.getQuantity());
        item.setCustomizations(request.getCustomizations());

        item = cartItemRepository.save(item);
        return mapToResponse(item);
    }

    @Transactional
    public CartItemResponse updateItem(Long userId, Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Cart item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }

        item.setQuantity(quantity);
        item = cartItemRepository.save(item);
        return mapToResponse(item);
    }

    @Transactional
    public void removeItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Cart item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemResponse mapToResponse(CartItem item) {
        Fabric f = item.getFabric();
        FabricResponse fabricResponse = new FabricResponse(
            f.getId(), f.getName(), f.getType(), f.getDescription(),
            f.getPricePerMeter(), f.getImageUrl(), f.isInStock(),
            f.getColor(), f.getMaterial()
        );

        Style s = item.getStyle();
        StyleResponse styleResponse = new StyleResponse(
            s.getId(), s.getName(), s.getCategory(), s.getDescription(),
            s.getBasePrice(), s.getImageUrl()
        );

        return new CartItemResponse(
            item.getId(), item.getUserId(), item.getQuantity(), item.getCustomizations(),
            fabricResponse, styleResponse
        );
    }
}
