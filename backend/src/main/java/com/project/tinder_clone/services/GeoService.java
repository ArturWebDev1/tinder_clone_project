package com.project.tinder_clone.services;


public interface GeoService {

    void updateLocation(Long userId, double lat, double lon);
}
