package com.stitchit.service;

import com.stitchit.dto.*;
import com.stitchit.entity.*;
import com.stitchit.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User customer = userRepository.findById(userId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Customer not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PLACED);
        order.setShippingAddressId(request.getShippingAddressId());
        order.setEstimatedDelivery(LocalDate.now().plusDays(10));

        for (CartItem cItem : cartItems) {
            BigDecimal itemPrice = cItem.getStyle().getBasePrice()
                .add(cItem.getFabric().getPricePerMeter().multiply(BigDecimal.valueOf(2))); // assume 2 meters avg
            BigDecimal lineTotal = itemPrice.multiply(BigDecimal.valueOf(cItem.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFabric(cItem.getFabric());
            orderItem.setStyle(cItem.getStyle());
            orderItem.setQuantity(cItem.getQuantity());
            orderItem.setPrice(lineTotal);
            orderItem.setCustomizations(cItem.getCustomizations());

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);

        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersForUser(Long userId) {
        return orderRepository.findByCustomerId(userId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(userId)) {
            // For now allow if matching customer, in full system admin/tailor checks apply
        }

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new IllegalStateException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    private boolean isValidTransition(OrderStatus current, OrderStatus next) {
        // State Machine: PLACED → TAILOR_ASSIGNED → VISIT_SCHEDULED → MEASUREMENTS_TAKEN → STITCHING → QC_PENDING → SHIPPED → DELIVERED
        switch (current) {
            case PLACED:
                return next == OrderStatus.TAILOR_ASSIGNED;
            case TAILOR_ASSIGNED:
                return next == OrderStatus.VISIT_SCHEDULED;
            case VISIT_SCHEDULED:
                return next == OrderStatus.MEASUREMENTS_TAKEN;
            case MEASUREMENTS_TAKEN:
                return next == OrderStatus.STITCHING;
            case STITCHING:
                return next == OrderStatus.QC_PENDING;
            case QC_PENDING:
                return next == OrderStatus.SHIPPED;
            case SHIPPED:
                return next == OrderStatus.DELIVERED;
            case DELIVERED:
                return false;
            default:
                return false;
        }
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
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

            return new OrderItemResponse(
                item.getId(), item.getQuantity(), item.getPrice(), item.getCustomizations(),
                fabricResponse, styleResponse
            );
        }).collect(Collectors.toList());

        return new OrderResponse(
            order.getId(), order.getCustomer().getId(), order.getTailorId(), order.getStatus(),
            order.getTotalAmount(), order.getShippingAddressId(), order.getEstimatedDelivery(),
            itemResponses, order.getCreatedAt(), order.getUpdatedAt()
        );
    }
}
