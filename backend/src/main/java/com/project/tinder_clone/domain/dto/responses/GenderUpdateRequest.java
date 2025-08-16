package com.project.tinder_clone.domain.dto.responses;

import com.project.tinder_clone.domain.entries.UserProfile;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenderUpdateRequest {
    @NotNull
    private UserProfile.Gender gender;
}
