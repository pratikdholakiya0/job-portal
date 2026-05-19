package com.example.jobportal.application.dto;

import com.example.jobportal.application.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationStatusUpdate {
    @NotNull(message = "New status is required.")
    private String applicationId;

    @NotNull(message = "New status is required.")
    private ApplicationStatus newStatus;
}
