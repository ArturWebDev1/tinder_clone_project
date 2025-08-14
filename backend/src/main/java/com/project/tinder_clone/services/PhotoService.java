package com.project.tinder_clone.services;

import org.springframework.web.multipart.MultipartFile;

public interface PhotoService {
    String uploadPhoto(MultipartFile file);
}
