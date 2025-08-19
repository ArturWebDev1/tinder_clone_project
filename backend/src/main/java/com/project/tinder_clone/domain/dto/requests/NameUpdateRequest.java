package com.project.tinder_clone.domain.dto.requests;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NameUpdateRequest {
    @NotNull
    private String name;
}
