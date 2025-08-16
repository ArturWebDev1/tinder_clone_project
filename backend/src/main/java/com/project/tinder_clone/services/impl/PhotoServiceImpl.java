package com.project.tinder_clone.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.tinder_clone.domain.entries.Photo;
import com.project.tinder_clone.domain.entries.UserProfile;
import com.project.tinder_clone.repositories.PhotoRepository;
import com.project.tinder_clone.repositories.UserProfileRepository;
import com.project.tinder_clone.services.PhotoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {

    private final Cloudinary cloudinary;
    private final UserProfileRepository userRepo;
    private final PhotoRepository photoRepo;

    @Override
    public String uploadPhoto(MultipartFile file) {
        try {
            Map<String, Object> uploadResult =
                    cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IllegalStateException("Photo upload failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    @Override
    public Photo uploadAndAttach(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        // при желании: проверить контент-тайп
        // if (!Objects.equals(file.getContentType(), "image/jpeg") ...) ...

        UserProfile user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        String url = uploadPhoto(file);

        Photo photo = Photo.builder()
                .url(url)
                .user(user)
                .build();

        return photoRepo.save(photo);
    }
}
