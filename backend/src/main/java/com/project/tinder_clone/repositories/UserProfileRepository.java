package com.project.tinder_clone.repositories;

import com.project.tinder_clone.domain.entries.UserProfile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByPhoneNumber(String phoneNumber);

    @EntityGraph(attributePaths = "photos")
    Optional<UserProfile> findById(Long id);
}
