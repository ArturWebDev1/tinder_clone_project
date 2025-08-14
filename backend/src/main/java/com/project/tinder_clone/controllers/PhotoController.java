package com.project.tinder_clone.controllers;

import com.project.tinder_clone.services.impl.PhotoServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoServiceImpl photoService;

    public PhotoController(PhotoServiceImpl photoService) {
        this.photoService = photoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            String url = photoService.uploadPhoto(file);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        }
    }
}
