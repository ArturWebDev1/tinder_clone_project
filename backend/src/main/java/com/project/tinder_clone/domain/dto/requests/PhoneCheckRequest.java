package com.project.tinder_clone.domain.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PhoneCheckRequest {
    @NotBlank
    private String phone;
}