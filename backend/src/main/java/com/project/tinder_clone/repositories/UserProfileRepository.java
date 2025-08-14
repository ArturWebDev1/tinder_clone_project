package com.project.tinder_clone.repositories;

import com.project.tinder_clone.domain.entries.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {}
