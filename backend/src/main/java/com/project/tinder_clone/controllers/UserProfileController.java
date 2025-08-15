package com.project.tinder_clone.controllers;

import com.project.tinder_clone.domain.dto.responses.IdResponse;
import com.project.tinder_clone.domain.dto.ProfileDto;
import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.mapper.ProfileMapper;
import com.project.tinder_clone.services.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService profileService;
    private final ProfileMapper profileMapper;

    @PostMapping("/name")
    public IdResponse create(@RequestBody @Valid ProfileDto profile) {
        UserProfile saved = profileService.createProfile(profileMapper.toEntity(profile));
        return new IdResponse(saved.getId());
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
