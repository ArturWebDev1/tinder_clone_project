package com.project.tinder_clone.controllers;

import com.project.tinder_clone.domain.dto.responses.PhotoUploadResponse;
import com.project.tinder_clone.domain.entries.Photo;
import com.project.tinder_clone.services.PhotoService;
import com.project.tinder_clone.services.impl.PhotoServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PatchMapping(
            path = "/{id}/photos/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<PhotoUploadResponse> uploadPhoto(
            @PathVariable("id") Long userId,
            @RequestParam("file") MultipartFile file) {

        Photo saved = photoService.uploadAndAttach(userId, file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new PhotoUploadResponse(saved.getId(), saved.getUrl()));
    }
}
