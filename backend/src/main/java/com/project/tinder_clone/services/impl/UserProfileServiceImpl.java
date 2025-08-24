package com.project.tinder_clone.services.impl;

import com.project.tinder_clone.domain.dto.requests.PhoneCheckRequest;
import com.project.tinder_clone.domain.dto.responses.PhoneCheckResponse;
import com.project.tinder_clone.domain.dto.responses.ProfileWelcomeResponse;
import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.mapper.ProfileMapper;
import com.project.tinder_clone.repositories.UserProfileRepository;
import com.project.tinder_clone.services.UserProfileService;
import com.project.tinder_clone.utils.PhoneNormalizer;
import jakarta.persistence.Column;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.concurrent.ThreadLocalRandom;


@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userRepo;
    private final PhoneNormalizer normalizer;
    private final ProfileMapper profileMapper;

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

    @Transactional
    @Override
    public UserProfile updateName(Long id, String name) {
        UserProfile profile = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found: " + id));
        profile.setName(name);
        return profile;
    }


    @Transactional
    @Override
    public UserProfile updateBirthdate(Long id, LocalDate birthdate) {
        UserProfile p = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("UserProfile not found: " + id));

        // бизнес-правило 18+ (если нужно)
        int years = Period.between(birthdate, LocalDate.now()).getYears();
        if (years < 18) {
            throw new IllegalArgumentException("User must be at least 18 years old");
        }

        p.setBirthdate(birthdate);
        p.setAge(years); // держим поле age в актуальном состоянии
        return p; // благодаря @Transactional, Hibernate сам сделает UPDATE
    }


    @Transactional
    @Override
    public UserProfile updateGender(Long id, UserProfile.Gender gender) {
        UserProfile profile = userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found: " + id));
        profile.setGender(gender);
        return profile;
    }


    @Transactional
    @Override
    public PhoneCheckResponse findByNumber(String phoneNumber) {
        String e164 = normalizer.toE164(phoneNumber);

        return userRepo.findByPhoneNumber(e164)
                .map(u -> new PhoneCheckResponse(true, u.getId(), null))
                .orElseGet(() -> {
                    String code = generateCode();

                    return new PhoneCheckResponse(false, null, code);
                });
    }

    @Override
    @Transactional
    @Cacheable(value = USER_CACHE, key = "#userId")
    public ProfileWelcomeResponse getWelcomeDtoById(Long userId) {
        UserProfile profile = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found with id " + userId));
        return profileMapper.toWelcome(profile);
    }

    private String generateCode() {
        // 6 случайных цифр, ведущие нули допустимы
        int n = ThreadLocalRandom.current().nextInt(0, 1_000_000);
        return String.format("%06d", n);
    }


}
