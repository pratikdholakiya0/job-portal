package com.example.jobportal.user.controller;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.user.dto.ProfileRequest;
import com.example.jobportal.user.dto.ResponseMessage;
import com.example.jobportal.user.entity.Profile;
import com.example.jobportal.user.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@Tag(name = "User Profile Management", description = "Endpoints for building, retrieving, and updating the generic user profile.")
public class UserController {
    @Autowired
    private ProfileService userService;

    @PostMapping("/build-profile")
    @Operation(summary = "Build the user's initial profile",
            description = "Allows any authenticated user (Applicant or Employer) to create their initial generic profile details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile created successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request or profile already exists."),
            @ApiResponse(responseCode = "401", description = "Authentication required.")
    })
    public ResponseEntity<ResponseMessage> buildProfile(@RequestBody ProfileRequest profile,
                                                        @AuthenticationPrincipal JobPortalUserPrincipal principal){

        if (principal == null) throw new AccessDeniedException("Authentication required to create profile.");

        Profile profileDb = userService.buildProfile(profile, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Profile created successfully")
                .email(profileDb.getEmail())
                .build();
        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/get-profile")
    @Operation(summary = "Retrieve the authenticated user's profile",
            description = "Retrieves the generic profile details for the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile."),
            @ApiResponse(responseCode = "401", description = "Authentication required."),
            @ApiResponse(responseCode = "404", description = "Profile not found for the user.")
    })
    public ResponseEntity<Profile> getProfile(@AuthenticationPrincipal JobPortalUserPrincipal principal){
        // No explicit check for principal == null here, as it's handled by the service/security layer,
        // but it's good practice to ensure it's not null before calling the service.
        if (principal == null) throw new AccessDeniedException("Authentication required to get profile.");

        Profile profileDb = userService.getProfile(principal);
        return ResponseEntity.ok(profileDb);
    }

    @PutMapping("/update-profile")
    @Operation(summary = "Update the user's existing profile",
            description = "Allows the authenticated user to update their generic profile details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request data."),
            @ApiResponse(responseCode = "401", description = "Authentication required."),
            @ApiResponse(responseCode = "404", description = "Profile not found for update.")
    })
    public ResponseEntity<ResponseMessage> updateProfile(
            @RequestBody ProfileRequest profile,
            @AuthenticationPrincipal JobPortalUserPrincipal principal){

        if (principal == null) throw new AccessDeniedException("Authentication required to update profile.");

        Profile profileDb = userService.updateProfile(profile,  principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Profile updated successfully")
                .email(profileDb.getEmail())
                .build();
        return ResponseEntity.ok(responseMessage);
    }
}