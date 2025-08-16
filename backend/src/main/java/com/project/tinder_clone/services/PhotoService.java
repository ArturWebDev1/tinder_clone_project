package com.project.tinder_clone.services;

import com.project.tinder_clone.domain.entries.Photo;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoService {
    String uploadPhoto(MultipartFile file);

    Photo uploadAndAttach(Long userId, MultipartFile file);
}
