package com.example.jobportal.candidate.controller;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.candidate.entity.Resume;
import com.example.jobportal.candidate.service.ResumeService;
import com.example.jobportal.user.dto.ResponseMessage; // Assuming this DTO exists for status messages
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resume")
@Tag(name = "Candidate Resume Management", description = "Endpoints for creating, retrieving, and updating the candidate's resume/profile.")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/create")
    @Operation(summary = "Create a candidate resume profile",
            description = "Allows an authenticated **APPLICANT** to create their professional profile/resume. Only one profile per user is allowed.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Candidate profile created successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid data or profile already exists."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an APPLICANT or access is denied).")
    })
    public ResponseEntity<ResponseMessage> createProfile(@RequestBody Resume resume, @AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) throw new AccessDeniedException("Authentication required to create resume profile.");

        Resume profile = resumeService.createCandidateProfile(resume, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Candidate profile created successfully.")
                .build();
        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);
    }

    @GetMapping("/get")
    @Operation(summary = "Retrieve the current candidate's resume profile",
            description = "Allows an authenticated **APPLICANT** to retrieve their personal profile details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved candidate profile."),
            @ApiResponse(responseCode = "404", description = "Profile not found for the current user."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an APPLICANT or access is denied).")
    })
    public ResponseEntity<Resume> getResume(@AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) throw new AccessDeniedException("Authentication required to get resume profile.");

        Resume profile = resumeService.getResume(principal);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    @Operation(summary = "Update the candidate's resume profile",
            description = "Allows an authenticated **APPLICANT** to update their existing professional profile/resume.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Candidate profile updated successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid data format or missing required fields."),
            @ApiResponse(responseCode = "404", description = "Profile not found for update."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an APPLICANT or access is denied).")
    })
    public ResponseEntity<ResponseMessage> updateProfile(
            @RequestBody Resume resume,
            @AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) throw new AccessDeniedException("Authentication required to update resume profile.");

        Resume updatedProfile = resumeService.updateResume(resume, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Candidate profile updated successfully.")
                .build();
        return ResponseEntity.ok(responseMessage);
    }
}