package com.project.tinder_clone.domain.dto.requests;

import lombok.Data;

@Data
public class LocationUpdateRequest {
    private double lat;
    private double lon;
}
