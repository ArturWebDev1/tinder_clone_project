package com.project.tinder_clone.services;

import com.project.tinder_clone.domain.entries.UserProfile;


public interface UserProfileService {
    UserProfile createProfile(UserProfile profile);

    void deleteProfileById(Long id);

    UserProfile getProfileById(Long id);

    UserProfile updateProfileById(Long id, UserProfile profile);

}
