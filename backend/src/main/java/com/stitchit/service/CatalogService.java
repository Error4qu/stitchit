package com.stitchit.service;

import com.stitchit.dto.FabricResponse;
import com.stitchit.dto.StyleResponse;
import com.stitchit.entity.Fabric;
import com.stitchit.entity.Style;
import com.stitchit.repository.FabricRepository;
import com.stitchit.repository.StyleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogService {

    private final FabricRepository fabricRepository;
    private final StyleRepository styleRepository;

    public CatalogService(FabricRepository fabricRepository, StyleRepository styleRepository) {
        this.fabricRepository = fabricRepository;
        this.styleRepository = styleRepository;
    }

    public List<FabricResponse> getAllFabrics(String type, String name) {
        List<Fabric> fabrics;
        if (name != null && !name.isBlank()) {
            fabrics = fabricRepository.findByNameContainingIgnoreCase(name);
        } else if (type != null && !type.isBlank()) {
            fabrics = fabricRepository.findByType(type);
        } else {
            fabrics = fabricRepository.findAll();
        }

        return fabrics.stream().map(this::mapFabric).collect(Collectors.toList());
    }

    public FabricResponse getFabricById(Long id) {
        Fabric fabric = fabricRepository.findById(id)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Fabric not found with id: " + id));
        return mapFabric(fabric);
    }

    public List<StyleResponse> getAllStyles(String category) {
        List<Style> styles;
        if (category != null && !category.isBlank()) {
            styles = styleRepository.findByCategory(category);
        } else {
            styles = styleRepository.findAll();
        }

        return styles.stream().map(this::mapStyle).collect(Collectors.toList());
    }

    public StyleResponse getStyleById(Long id) {
        Style style = styleRepository.findById(id)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Style not found with id: " + id));
        return mapStyle(style);
    }

    private FabricResponse mapFabric(Fabric f) {
        return new FabricResponse(
            f.getId(), f.getName(), f.getType(), f.getDescription(),
            f.getPricePerMeter(), f.getImageUrl(), f.isInStock(),
            f.getColor(), f.getMaterial()
        );
    }

    private StyleResponse mapStyle(Style s) {
        return new StyleResponse(
            s.getId(), s.getName(), s.getCategory(), s.getDescription(),
            s.getBasePrice(), s.getImageUrl()
        );
    }
}
