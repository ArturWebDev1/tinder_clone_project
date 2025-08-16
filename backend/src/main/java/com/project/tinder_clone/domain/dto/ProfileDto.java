package com.project.tinder_clone.domain.dto;


import com.project.tinder_clone.domain.entries.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private Integer age;
    private LocalDate birthdate;
    private UserProfile.Gender gender;
}
