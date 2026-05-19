package com.example.jobportal.application.entity;

import com.example.jobportal.application.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "application")
public class Application {
    @Id
    private String id;

    @NotBlank
    private String userId;

    @NotBlank
    private String companyId;
    @NotBlank
    @Indexed(unique = true)
    private String jobId;
    private String jobTitle;

    private Date applicationDate;
    private ApplicationStatus status;
    private String coverLetterText;
}
