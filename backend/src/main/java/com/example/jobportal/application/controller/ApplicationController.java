package com.example.jobportal.application.controller;

import com.example.jobportal.application.dto.ApplicationStatusUpdate;
import com.example.jobportal.application.dto.ApplicationSubmissionRequest;
import com.example.jobportal.application.entity.Application;
import com.example.jobportal.application.entity.ApplicationActivity;
import com.example.jobportal.application.service.ApplicationService;
import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.user.dto.ResponseMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Job Applications", description = "Operations for submitting, viewing, and managing job applications and their status history.")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit a job application",
            description = "Allows an **APPLICANT** to submit a new application for a job posting. Requires applicant role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Application submitted successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request (e.g., missing fields, job not found)."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an APPLICANT or access is denied).")
    })
    public ResponseEntity<ResponseMessage> submitApplication(
            @RequestBody ApplicationSubmissionRequest request,
            @AuthenticationPrincipal JobPortalUserPrincipal principal
    ) {
        if (principal == null) throw new AccessDeniedException("Authentication required to submit an application.");

        applicationService.applyToJob(request, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Application submitted successfully.")
                .build();
        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Retrieve all applications submitted by the current candidate",
            description = "Allows an **APPLICANT** to view their personal application history, paginated.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of applications."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an APPLICANT or access is denied).")
    })
    public ResponseEntity<List<Application>> getCandidateApplications(
            @AuthenticationPrincipal JobPortalUserPrincipal principal,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "5", required = false) int size) {
        if (principal == null) throw new AccessDeniedException("Authentication required to view applications.");

        List<Application> applications = applicationService.getApplicationsByCandidate(principal, page, size);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "Retrieve a specific application by ID",
            description = "Allows an **APPLICANT** to view details of one of their applications. The service layer must ensure the application belongs to the current user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved application details."),
            @ApiResponse(responseCode = "404", description = "Application not found."),
            @ApiResponse(responseCode = "403", description = "Forbidden (Application does not belong to the user).")
    })
    public ResponseEntity<Application> getCandidateApplications(
            @AuthenticationPrincipal JobPortalUserPrincipal principal,
            @PathVariable("id") String id) {
        if (principal == null) throw new AccessDeniedException("Authentication required to view applications.");

        Application application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/by-employer")
    @Operation(summary = "Retrieve all applications for the employer's jobs",
            description = "Allows an **EMPLOYER** to view all applications submitted for job postings managed by their company.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of applications for the employer's jobs."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or access is denied).")
    })
    public ResponseEntity<List<Application>> getApplicationsForEmployer(
            @AuthenticationPrincipal JobPortalUserPrincipal principal) {
        if (principal == null) throw new AccessDeniedException("Authentication required to view applications.");

        List<Application> applications = applicationService.getApplicationsByEmployer(principal);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/history/{applicationId}")
    @Operation(summary = "Retrieve the status history of a specific application",
            description = "Allows either the **APPLICANT** (for their own application) or the **EMPLOYER** (for a job they manage) to view the chronological activity log.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved application history."),
            @ApiResponse(responseCode = "404", description = "Application not found."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not authorized to view this application's history).")
    })
    public ResponseEntity<List<ApplicationActivity>> getApplicationHistory(
            @PathVariable String applicationId,
            @AuthenticationPrincipal JobPortalUserPrincipal principal) {
        if (principal == null) throw new AccessDeniedException("Authentication required to view application history.");

        List<ApplicationActivity> history = applicationService.getApplicationHistory(applicationId,  principal);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/status/update")
    @Operation(summary = "Update the status of an application",
            description = "Allows an **EMPLOYER** to change the status (e.g., PENDING, REVIEWED, REJECTED) of an application for a job they manage.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application status updated successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid status transition or request data."),
            @ApiResponse(responseCode = "404", description = "Application not found."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or does not manage the job).")
    })
    public ResponseEntity<ResponseMessage> updateApplicationStatus(
            @RequestBody ApplicationStatusUpdate request,
            @AuthenticationPrincipal JobPortalUserPrincipal principal
    ) {
        if (principal == null) throw new AccessDeniedException("Authentication required to update application status.");

        applicationService.updateApplicationStatus(request, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Application status updated successfully.")
                .build();
        return ResponseEntity.ok(responseMessage);
    }
}