package com.project.tinder_clone.domain.entries;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * Entity to store a user's preferences. This separates concerns from the main
 * UserProfile entity for better data organization and scalability.
 * It implements Serializable to be compatible with Redis caching.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preference implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    // A user's preferred age range for matching
    private int ageRangeMin = 18;
    private int ageRangeMax = 35;

    // A user's preferred gender for matching.
    // Consider using an Enum for this in a real application.
    private String genderPreference;

    // The 'mappedBy' attribute tells JPA that this side of the relationship is
    // the inverse side, and it should not create a new foreign key column.
    // The 'preference' field in the 'UserProfile' entity is the owning side.
    @OneToOne(mappedBy = "preference")
    private UserProfile userProfile;
}
