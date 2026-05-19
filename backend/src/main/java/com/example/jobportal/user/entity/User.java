package com.example.jobportal.user.entity;

import com.example.jobportal.user.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    @Indexed(unique = true)
    @NotNull
    private String email;
    private String password;
    @NotNull
    private Role role;
    private boolean isActive;
    private Date creationDate;
}
