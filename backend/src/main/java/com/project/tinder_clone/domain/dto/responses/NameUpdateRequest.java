package com.project.tinder_clone.domain.dto.responses;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NameUpdateRequest {
    @NotNull
    private String name;
}
