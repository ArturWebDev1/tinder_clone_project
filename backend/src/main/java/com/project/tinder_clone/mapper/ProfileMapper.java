package com.project.tinder_clone.mapper;

import com.project.tinder_clone.domain.dto.PhotoDto;
import com.project.tinder_clone.domain.dto.ProfileDto;
import com.project.tinder_clone.domain.dto.responses.ProfileWelcomeResponse;
import com.project.tinder_clone.domain.entries.Photo;
import com.project.tinder_clone.domain.entries.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    ProfileDto toDTO(UserProfile profile);

    ProfileDto toDTO(Long id);

    UserProfile toEntity(ProfileDto dto);

    List<ProfileDto> toDTOs(List<UserProfile> profiles);

    ProfileWelcomeResponse toWelcome(UserProfile entity);

    PhotoDto toPhotoDto(Photo photo);

    List<PhotoDto> toPhotoDtos(List<Photo> photos);
}
