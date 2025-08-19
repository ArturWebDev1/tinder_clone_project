package com.project.tinder_clone.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileWelcomeResponse {
    private String name;
    private Integer age;
    private List<String> photos;
}
