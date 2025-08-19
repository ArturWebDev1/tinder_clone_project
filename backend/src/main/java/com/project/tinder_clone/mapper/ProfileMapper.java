package com.project.tinder_clone.mapper;

import com.project.tinder_clone.domain.dto.PhotoDto;
import com.project.tinder_clone.domain.dto.ProfileDto;
import com.project.tinder_clone.domain.dto.responses.ProfileWelcomeResponse;
import com.project.tinder_clone.domain.entries.Photo;
import com.project.tinder_clone.domain.entries.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProfileMapper {
    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    ProfileDto toDTO(UserProfile profile);

    ProfileDto toDTO(Long id);

    UserProfile toEntity(ProfileDto dto);

    List<ProfileDto> toDTOs(List<UserProfile> profiles);

    @Mapping(target = "photos", expression = "java(photoUrls(entity.getPhotos()))")
    ProfileWelcomeResponse toWelcome(UserProfile entity);

    default List<String> photoUrls(List<Photo> photos) {
        if (photos == null) return java.util.Collections.emptyList();
        return photos.stream().map(Photo::getUrl).toList();
    }

}
