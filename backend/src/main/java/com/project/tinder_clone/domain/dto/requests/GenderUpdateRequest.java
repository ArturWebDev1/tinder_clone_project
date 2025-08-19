package com.project.tinder_clone.domain.dto.requests;

import com.project.tinder_clone.domain.entries.UserProfile;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenderUpdateRequest {
    @NotNull
    private UserProfile.Gender gender;
}
