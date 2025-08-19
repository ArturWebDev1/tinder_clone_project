package com.project.tinder_clone.domain.dto.responses;

import com.project.tinder_clone.domain.entries.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@Data
@AllArgsConstructor
public class ProfileWelcomeResponse {
    private String name;
    private Integer age;
    private List<String> photos;
}
