package com.project.tinder_clone.domain.entries;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

/**
 * The UserProfile entity, which serves as the core user model.
 * It now has bidirectional relationships with Preference, Geolocation, and Photo entities.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile implements Serializable {

    // It is a best practice to add a serialVersionUID for versioning.
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @NotBlank
    @Column(nullable=false)
    private String name;

    @Column(nullable=false)
    @Min(18)
    private int age;

    @Size(max=500)
    private String bio;

//    @Column(nullable=false)
//    private double longitude = 333.4;  // take this input later from a user
//
//    @Column(nullable=false)
//    private double latitude = 38.3;  // take this input later from a user


    // A one-to-one relationship with the Preference entity.
    // 'cascade = CascadeType.ALL' ensures that saving/deleting a UserProfile
    // will also save/delete its associated Preference.
    // The 'JoinColumn' specifies that the 'user_profile' table will have a
    // 'preference_id' foreign key that links to the 'preference' table.
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "preference_id", referencedColumnName = "id")
    private Preference preference;

    // A one-to-many relationship with the Photo entity.
    // 'mappedBy = "user"' indicates that the 'Photo' entity owns the relationship
    // via its 'user' field. This tells JPA not to create a new foreign key column here.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Photo> photos;
}
