package com.example.jobportal.user.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;
    @Indexed(unique = true, name = "user_id")
    @NotBlank
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String location;
    private String jobTitle;
    private String bio;
}
