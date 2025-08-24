package com.project.tinder_clone.controllers;

import com.project.tinder_clone.domain.dto.requests.LocationUpdateRequest;
import com.project.tinder_clone.services.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class GeoController {
    private final GeoService geoService;

    @PatchMapping("/{id}/location")
    public ResponseEntity<Void> updateLocation(@PathVariable Long id,
                                               @RequestBody LocationUpdateRequest body) {
        geoService.updateLocation(id, body.getLat(), body.getLon());
        return ResponseEntity.noContent().build();
    }
}
