package com.project.tinder_clone.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.tinder_clone.services.PhotoService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class PhotoServiceImpl implements PhotoService {

    private final Cloudinary cloudinary;

    public PhotoServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadPhoto(MultipartFile file) {
        Map uploadResult = null;
        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        } catch (IOException e) {
            return "Mistake with photo upload" + e.getMessage();
        }
        return (String) uploadResult.get("secure_url");
    }
}
