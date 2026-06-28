package com.stitchit.repository;

import com.stitchit.entity.Fabric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FabricRepository extends JpaRepository<Fabric, Long> {
    List<Fabric> findByType(String type);
    List<Fabric> findByInStockTrue();
    List<Fabric> findByNameContainingIgnoreCase(String name);
}
