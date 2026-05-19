package com.example.jobportal.job.controller;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.job.dto.JobPostingDto;
import com.example.jobportal.job.entity.JobPosting;
import com.example.jobportal.job.service.JobPostingService;
import com.example.jobportal.user.dto.ResponseMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/jobs")
@Tag(name = "Job Posting Management", description = "Endpoints for creating, viewing, and managing job postings.")
public class JobPostingController {

    @Autowired
    private JobPostingService jobPostingService;

    @PostMapping("/create")
    @Operation(summary = "Create a new job posting",
            description = "Allows an authenticated **EMPLOYER** to post a new job opening.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job post created successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request data or missing company profile."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or access is denied).")
    })
    public ResponseEntity<ResponseMessage> createJobPosting(
            @RequestBody JobPostingDto jobPostingDto,
            @AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) throw new AccessDeniedException("Authentication required to create job profile.");

        JobPosting jobPosting = jobPostingService.createJobPosting(jobPostingDto, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Job post created")
                .build();
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @PutMapping("update/{jobId}")
    @Operation(summary = "Update an existing job posting",
            description = "Allows the **EMPLOYER** who owns the job posting to modify its details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job post updated successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request data."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User does not own this job post)."),
            @ApiResponse(responseCode = "404", description = "Job posting not found.")
    })
    public ResponseEntity<ResponseMessage> updateJobPosting(
            @PathVariable String jobId,
            @RequestBody JobPostingDto jobPostingUpdates,
            @AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) throw new AccessDeniedException("Authentication required to update job profile.");

        JobPosting updatedJob = jobPostingService.updateJobPosting(jobId, jobPostingUpdates,  principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Job post updated successfully")
                .build();
        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/getAllActive")
    @Operation(summary = "Get all active jobs posted by the current Employer",
            description = "Allows an authenticated **EMPLOYER** to retrieve a list of all job postings they have created.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of jobs."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or access is denied).")
    })
    public ResponseEntity<List<JobPosting>> getAllActiveJobs(@AuthenticationPrincipal JobPortalUserPrincipal principal) {
        List<JobPosting> jobs = jobPostingService.findAllJobsByUser(principal);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/getAll")
    @Operation(summary = "Get all job postings (Public/Paginated)",
            description = "Allows any user (authenticated or public) to view a paginated list of all active job postings.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the paginated list of all jobs.")
    })
    public ResponseEntity<List<JobPosting>> getAllJobs(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "100", required = false) int size) {
        List<JobPosting> paginatedJobs = jobPostingService.getRecentJobs(page, size);
        return ResponseEntity.ok(paginatedJobs);
    }

    @GetMapping("/getById/{jobId}")
    @Operation(summary = "Get a job posting by ID (Public Access)",
            description = "Allows any user (authenticated or public) to view the details of a specific job posting by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved job details."),
            @ApiResponse(responseCode = "404", description = "Job posting not found.")
    })
    public ResponseEntity<JobPosting> getJobById(@PathVariable String jobId) {
        JobPosting job = jobPostingService.findJobPostById(jobId);
        return ResponseEntity.ok(job);
    }
}