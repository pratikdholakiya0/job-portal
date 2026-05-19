package com.example.jobportal.application.entity;


import com.example.jobportal.application.enums.ApplicationStatus;
import com.example.jobportal.user.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "application_activity")
public class ApplicationActivity {
    @Id
    private String id;
    @NotBlank
    private String applicationId;
    private Date timestamp;
    private String note;
    private ApplicationStatus status;
    private Role statusChangedBy;
}
