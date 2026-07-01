package com.stitchit.repository;

import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByProviderAndProviderAccountId(String provider, String providerAccountId);
    List<User> findByRole(Role role);
    Page<User> findByRole(Role role, Pageable pageable);
}
