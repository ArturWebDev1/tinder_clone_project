package com.project.tinder_clone.controllers;

import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.services.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService profileService;

    @PostMapping
    public ResponseEntity<UserProfile> create(@RequestBody @Valid UserProfile profile) {
        UserProfile saved = profileService.createProfile(profile);
        return ResponseEntity.ok(saved);
    }


    @DeleteMapping(path = "/{id}")
    public void deleteProfileById(@PathVariable("id") Long id) {
        profileService.deleteProfileById(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable("id") Long id) {
        UserProfile userProfile = profileService.getProfileById(id);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateProfileById(
            @PathVariable("id") Long id,
            @RequestBody UserProfile profile) {
        UserProfile updatedProfile = profileService.updateProfileById(id, profile);
        return ResponseEntity.ok(updatedProfile);
    }

}
