package com.stitchit.service;

import com.stitchit.dto.RevenueSummaryResponse;
import com.stitchit.dto.UserResponse;
import com.stitchit.entity.AlterationStatus;
import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import com.stitchit.repository.AlterationOrderRepository;
import com.stitchit.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AlterationOrderRepository orderRepository;

    public AdminService(UserRepository userRepository, AlterationOrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = role != null
                ? userRepository.findByRole(role, pageable)
                : userRepository.findAll(pageable);
        return users.map(this::toUserResponse);
    }

    @Transactional(readOnly = true)
    public RevenueSummaryResponse getRevenueSummary() {
        BigDecimal realized = orderRepository.sumTotalPriceByStatus(AlterationStatus.DELIVERED);
        BigDecimal pipeline = orderRepository.sumTotalPriceByStatusNot(AlterationStatus.DELIVERED);

        Map<AlterationStatus, Long> byStatus = new EnumMap<>(AlterationStatus.class);
        long total = 0;
        for (AlterationOrderRepository.StatusCount sc : orderRepository.countGroupedByStatus()) {
            byStatus.put(sc.getStatus(), sc.getCount());
            total += sc.getCount();
        }

        return new RevenueSummaryResponse(realized, pipeline, total, byStatus);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getRole(), user.getCreatedAt());
    }
}
