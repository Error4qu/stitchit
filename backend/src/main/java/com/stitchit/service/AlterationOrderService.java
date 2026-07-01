package com.stitchit.service;

import com.stitchit.config.CacheConfig;
import com.stitchit.dto.*;
import com.stitchit.entity.*;
import com.stitchit.repository.*;
import com.stitchit.util.InputSanitizer;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlterationOrderService {

    private final AlterationOrderRepository orderRepository;
    private final AlterationServiceRepository serviceRepository;
    private final AlterationCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public AlterationOrderService(AlterationOrderRepository orderRepository,
                                  AlterationServiceRepository serviceRepository,
                                  AlterationCategoryRepository categoryRepository,
                                  UserRepository userRepository,
                                  AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Cacheable(CacheConfig.CATEGORIES_CACHE)
    @Transactional(readOnly = true)
    public List<AlterationCategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(cat -> new AlterationCategoryResponse(
                        cat.getId(), cat.getType(), cat.getDisplayName(),
                        cat.getIcon(), cat.getDescription(), cat.getSortOrder(),
                        cat.getServices() != null ? cat.getServices().size() : 0
                ))
                .collect(Collectors.toList());
    }

    @Cacheable(value = CacheConfig.SERVICES_CACHE, key = "#categoryId")
    @Transactional(readOnly = true)
    public List<AlterationServiceResponse> getServicesByCategory(Long categoryId) {
        // Single JOIN FETCH query covers the common case; only an empty result
        // needs the extra existence check to distinguish 404 from empty category
        List<com.stitchit.entity.AlterationService> services =
                serviceRepository.findByCategoryIdWithCategory(categoryId);
        if (services.isEmpty() && !categoryRepository.existsById(categoryId)) {
            throw new jakarta.persistence.EntityNotFoundException(
                    "Category not found with id: " + categoryId);
        }
        return services.stream()
                .map(this::toServiceResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AlterationOrderResponse createOrder(AlterationOrderRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Customer not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(customer.getId())) {
            throw new AccessDeniedException("Address does not belong to this customer");
        }

        AlterationOrder order = new AlterationOrder();
        order.setCustomer(customer);
        order.setAddress(address);
        order.setScheduledDate(request.getScheduledDate());
        order.setScheduledSlot(request.getScheduledSlot());
        order.setSpecialInstructions(InputSanitizer.sanitize(request.getSpecialInstructions()));
        order.setStatus(AlterationStatus.BOOKED);

        BigDecimal total = BigDecimal.ZERO;
        for (AlterationOrderItemRequest itemReq : request.getItems()) {
            com.stitchit.entity.AlterationService svc = serviceRepository.findById(itemReq.getAlterationServiceId())
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                            "Alteration service not found: " + itemReq.getAlterationServiceId()));

            AlterationOrderItem item = new AlterationOrderItem();
            item.setAlterationOrder(order);
            item.setAlterationService(svc);
            item.setGarmentDescription(InputSanitizer.sanitize(itemReq.getGarmentDescription()));
            item.setCustomerNotes(InputSanitizer.sanitize(itemReq.getCustomerNotes()));
            item.setPrice(svc.getBasePrice());
            total = total.add(svc.getBasePrice());
            order.getItems().add(item);
        }

        order.setTotalPrice(total);
        AlterationOrder saved = orderRepository.save(order);
        return toOrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<AlterationOrderResponse> getCustomerOrders(String customerEmail, int page, int size) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Customer not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId(), pageable)
                .map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public Page<AlterationOrderResponse> getTailorOrders(String tailorEmail, int page, int size) {
        User tailor = userRepository.findByEmail(tailorEmail)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Tailor not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "scheduledDate"));
        return orderRepository.findByTailorIdOrderByScheduledDateAsc(tailor.getId(), pageable)
                .map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public Page<AlterationOrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public AlterationOrderResponse getOrderById(Long orderId, String userEmail) {
        AlterationOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Alteration order not found: " + orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));

        boolean isCustomer = order.getCustomer().getId().equals(user.getId());
        boolean isTailor = order.getTailor() != null && order.getTailor().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCustomer && !isTailor && !isAdmin) {
            throw new AccessDeniedException("Access denied to this order");
        }

        return toOrderResponse(order);
    }

    @Transactional
    public AlterationOrderResponse updateStatus(Long orderId, UpdateAlterationStatusRequest request,
                                                String userEmail) {
        AlterationOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Alteration order not found: " + orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));

        // Admins can set any status to unblock stuck orders; tailors follow the sequence
        if (user.getRole() != Role.ADMIN) {
            validateStatusTransition(order.getStatus(), request.getStatus());
        }
        order.setStatus(request.getStatus());

        if (request.getTailorNotes() != null) {
            order.setTailorNotes(InputSanitizer.sanitize(request.getTailorNotes()));
        }

        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public AlterationOrderResponse uploadPhotos(Long orderId, UploadPhotosRequest request,
                                                String userEmail) {
        AlterationOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Alteration order not found: " + orderId));

        if ("BEFORE".equalsIgnoreCase(request.getPhotoType())) {
            order.getBeforePhotos().addAll(request.getPhotoUrls());
        } else if ("AFTER".equalsIgnoreCase(request.getPhotoType())) {
            order.getAfterPhotos().addAll(request.getPhotoUrls());
        } else {
            throw new IllegalArgumentException("Photo type must be BEFORE or AFTER");
        }

        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public AlterationOrderResponse assignTailor(Long orderId, Long tailorId) {
        AlterationOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Alteration order not found: " + orderId));

        User tailor = userRepository.findById(tailorId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Tailor not found: " + tailorId));

        if (tailor.getRole() != Role.TAILOR) {
            throw new IllegalArgumentException("User is not a tailor");
        }

        order.setTailor(tailor);
        order.setStatus(AlterationStatus.TAILOR_ASSIGNED);
        return toOrderResponse(orderRepository.save(order));
    }

    private void validateStatusTransition(AlterationStatus current, AlterationStatus next) {
        boolean valid = switch (current) {
            case BOOKED -> next == AlterationStatus.TAILOR_ASSIGNED;
            case TAILOR_ASSIGNED -> next == AlterationStatus.TAILOR_VISITED;
            case TAILOR_VISITED -> next == AlterationStatus.GARMENT_COLLECTED;
            case GARMENT_COLLECTED -> next == AlterationStatus.IN_ALTERATION;
            case IN_ALTERATION -> next == AlterationStatus.QUALITY_CHECK;
            case QUALITY_CHECK -> next == AlterationStatus.OUT_FOR_DELIVERY;
            case OUT_FOR_DELIVERY -> next == AlterationStatus.DELIVERED;
            case DELIVERED -> false;
        };
        if (!valid) {
            throw new IllegalStateException(
                    "Invalid status transition from " + current + " to " + next);
        }
    }

    private AlterationOrderResponse toOrderResponse(AlterationOrder order) {
        AlterationOrderResponse resp = new AlterationOrderResponse();
        resp.setId(order.getId());
        resp.setCustomerId(order.getCustomer().getId());
        resp.setCustomerName(order.getCustomer().getName());
        if (order.getTailor() != null) {
            resp.setTailorId(order.getTailor().getId());
            resp.setTailorName(order.getTailor().getName());
        }
        resp.setScheduledDate(order.getScheduledDate());
        resp.setScheduledSlot(order.getScheduledSlot());
        resp.setScheduledSlotDisplay(order.getScheduledSlot().getDisplayName());
        resp.setStatus(order.getStatus());
        resp.setPaymentStatus(order.getPaymentStatus());
        resp.setTailorNotes(order.getTailorNotes());
        resp.setSpecialInstructions(order.getSpecialInstructions());
        // Copy lazy collections inside the transaction — the DTO must not hold
        // Hibernate proxies once the session is closed (OSIV is off)
        resp.setBeforePhotos(new ArrayList<>(order.getBeforePhotos()));
        resp.setAfterPhotos(new ArrayList<>(order.getAfterPhotos()));
        resp.setTotalPrice(order.getTotalPrice());
        resp.setCreatedAt(order.getCreatedAt());
        resp.setUpdatedAt(order.getUpdatedAt());

        if (order.getAddress() != null) {
            AddressResponse addr = new AddressResponse();
            addr.setId(order.getAddress().getId());
            addr.setStreet(order.getAddress().getStreet());
            addr.setCity(order.getAddress().getCity());
            addr.setState(order.getAddress().getState());
            addr.setPostalCode(order.getAddress().getPostalCode());
            addr.setCountry(order.getAddress().getCountry());
            resp.setAddress(addr);
        }

        resp.setItems(order.getItems().stream()
                .map(item -> {
                    AlterationOrderItemResponse ir = new AlterationOrderItemResponse();
                    ir.setId(item.getId());
                    ir.setAlterationServiceId(item.getAlterationService().getId());
                    ir.setAlterationServiceName(item.getAlterationService().getName());
                    ir.setAlterationServiceIcon(item.getAlterationService().getIcon());
                    ir.setGarmentDescription(item.getGarmentDescription());
                    ir.setCustomerNotes(item.getCustomerNotes());
                    ir.setPrice(item.getPrice());
                    return ir;
                }).collect(Collectors.toList()));

        return resp;
    }

    private AlterationServiceResponse toServiceResponse(com.stitchit.entity.AlterationService svc) {
        AlterationServiceResponse r = new AlterationServiceResponse();
        r.setId(svc.getId());
        r.setName(svc.getName());
        r.setDescription(svc.getDescription());
        r.setBasePrice(svc.getBasePrice());
        r.setEstimatedDays(svc.getEstimatedDays());
        r.setCategoryId(svc.getCategory().getId());
        r.setCategoryDisplayName(svc.getCategory().getDisplayName());
        r.setIcon(svc.getIcon());
        return r;
    }
}
