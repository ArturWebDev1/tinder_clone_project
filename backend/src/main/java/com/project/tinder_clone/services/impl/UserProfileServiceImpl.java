package com.project.tinder_clone.services.impl;

import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.repositories.UserProfileRepository;
import com.project.tinder_clone.services.UserProfileService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userRepo;

    public static final String USER_CACHE = "userCache";

    @Override
    public UserProfile createProfile(UserProfile profile) {
        return userRepo.save(profile);
    }

    /**
     * Deletes a user by their ID.
     * The @CacheEvict annotation removes the specified user from the cache after the
     * database deletion. This prevents stale data from being served if the user is
     * subsequently requested.
     *
     * @param userId The ID of the user to delete.
     */
    @CacheEvict(value = USER_CACHE, key = "#userId")
    @Override
    public void deleteProfileById(Long userId) {
        userRepo.deleteById(userId);
    }

    /**
     * Retrieves a user by their ID.
     * The @Cacheable annotation tells Spring to check the cache named "userCache" first
     * before executing the method. The key for the cache entry will be the userId.
     * If a value is found, it's returned immediately. If not, the method is executed,
     * and the result is stored in the cache.
     *
     * @param userId The ID of the user to retrieve.
     * @return The User object, if found.
     */
    @Override
    @Cacheable(value = USER_CACHE, key = "#userId")
    public UserProfile getProfileById(Long userId) {
        System.out.println("Fetching user from the database... (this message will only show on a cache miss)");
        return userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found with id " + userId));

    }

    /**
     * Updates an existing user.
     * The @CachePut annotation ensures that the cache is updated with the new User object
     * after the database update. Unlike @Cacheable, it always executes the method and then
     * updates the cache. The key is specified to match the userId.
     *
     * @param userId The ID of the user to update.
     * @param profile The User object with updated details.
     * @return The updated User object.
     */
    @CachePut(value = USER_CACHE, key = "#userId")
    @Transactional  // везде где больше чем один вызов репо, нужно добавлять для безопасности эту аннотацию
    @Override
    public UserProfile updateProfileById(Long userId, UserProfile profile) {
        // validation
        if (null == profile.getName() || profile.getName().isBlank()) {
            throw new IllegalArgumentException("A profile must have a name!");
        }

        // Changes
        UserProfile existingProfile = userRepo.findById(userId).orElseThrow(() -> {
            return new IllegalArgumentException("Task not found!");
        });

        existingProfile.setName(profile.getName());
        existingProfile.setAge(profile.getAge());
        existingProfile.setBio(profile.getBio());

        return userRepo.save(existingProfile);
    }
}
