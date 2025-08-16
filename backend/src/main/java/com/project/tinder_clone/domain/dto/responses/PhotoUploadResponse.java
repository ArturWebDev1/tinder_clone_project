package com.project.tinder_clone.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PhotoUploadResponse {
    private Long id;
    private String photoLink;
}