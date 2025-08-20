package com.project.tinder_clone.controllers;

import com.project.tinder_clone.domain.dto.requests.BirthdayUpdateRequest;
import com.project.tinder_clone.domain.dto.requests.GenderUpdateRequest;
import com.project.tinder_clone.domain.dto.requests.NameUpdateRequest;
import com.project.tinder_clone.domain.dto.requests.PhoneCheckRequest;
import com.project.tinder_clone.domain.dto.responses.*;
import com.project.tinder_clone.domain.dto.ProfileDto;
import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.mapper.ProfileMapper;
import com.project.tinder_clone.services.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService profileService;
    private final ProfileMapper profileMapper;

    @PostMapping("/verify-code")
    public IdResponse create(@RequestBody @Valid ProfileDto profile) {
        UserProfile saved = profileService.createProfile(profileMapper.toEntity(profile));
        return new IdResponse(saved.getId());
    }

    @DeleteMapping(path = "/{id}")
    public void deleteProfileById(@PathVariable("id") Long id) {
        profileService.deleteProfileById(id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateProfileById(
            @PathVariable("id") Long id,
            @RequestBody UserProfile profile) {
        UserProfile updatedProfile = profileService.updateProfileById(id, profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @PatchMapping("/{id}/name")
    public void updateName(
            @PathVariable Long id,
            @RequestBody @Valid NameUpdateRequest name) {

        profileService.updateName(id, name.getName());
    }

    @PatchMapping("/{id}/birthdate")
    public void updateBirthdate(
            @PathVariable Long id,
            @RequestBody @Valid BirthdayUpdateRequest body) {

        profileService.updateBirthdate(id, body.getBirthdate());
    }

    @PatchMapping("/{id}/gender")
    public void updateGender(
            @PathVariable Long id,
            @RequestBody @Valid GenderUpdateRequest request) {

        profileService.updateGender(id, request.getGender());
    }

    @PostMapping("/phone")
    public PhoneCheckResponse getByPhone(@RequestBody @Valid PhoneCheckRequest req) {
        return profileService.findByNumber(req.getPhoneNumber());
    }


    @GetMapping("/{id}")
    public ProfileWelcomeResponse getWelcome(@PathVariable Long id) {
        return profileService.getWelcomeDtoById(id);
    }
}
