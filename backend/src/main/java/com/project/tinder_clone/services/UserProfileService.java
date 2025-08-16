package com.project.tinder_clone.services;

import com.project.tinder_clone.domain.entries.UserProfile;
import jakarta.transaction.Transactional;

import java.time.LocalDate;


public interface UserProfileService {
    UserProfile createProfile(UserProfile profile);

    void deleteProfileById(Long id);

    UserProfile getProfileById(Long id);

    UserProfile updateProfileById(Long id, UserProfile profile);

    UserProfile updateBirthdate(Long id, LocalDate birthdate);

    UserProfile updateGender(Long id, UserProfile.Gender gender);
}
