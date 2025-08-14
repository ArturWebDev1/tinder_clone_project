package com.project.tinder_clone.repositories;

import com.project.tinder_clone.domain.entries.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<Photo, Long> { }
