package com.project.tinder_clone.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private Integer age;
}
