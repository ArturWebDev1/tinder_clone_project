package com.project.tinder_clone.services.impl;

import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.repositories.UserProfileRepository;
import com.project.tinder_clone.services.GeoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {
    private final UserProfileRepository userRepo;
    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional
    @Override
    public void updateLocation(Long id, double lat, double lon) {
        UserProfile profile = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found: " + id));
        Point p = gf.createPoint(new Coordinate(lon, lat));
        p.setSRID(4326);
        profile.setLocation(p);
    }
}
