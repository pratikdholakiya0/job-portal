package com.example.jobportal.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApplicationSubmissionRequest {

    @NotBlank(message = "Job ID is required for application submission.")
    private String jobId;

    @Size(max = 2000, message = "Cover letter cannot exceed 2000 characters.")
    private String coverLetterText; // Matches the field name in the Application entity
}
