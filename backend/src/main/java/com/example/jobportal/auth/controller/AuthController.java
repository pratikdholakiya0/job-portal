package com.example.jobportal.auth.controller;

import com.example.jobportal.auth.dto.request.LoginRequest;
import com.example.jobportal.auth.dto.response.LoginResponse;
import com.example.jobportal.auth.dto.request.RegisterRequest;
import com.example.jobportal.auth.dto.response.RegisterResponse;
import com.example.jobportal.auth.service.AuthService;
import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.user.repository.UserRepository;
import com.example.jobportal.util.Jwtutil;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User registration, login, token management, and user detail retrieval.")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private Jwtutil jwtutil;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    @Operation(summary = "Register a new user",
            description = "Creates a new user account (Applicant or Employer).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account created successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists.")
    })
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        RegisterResponse registerResponse = RegisterResponse.builder()
                .email(registerRequest.getEmail())
                .message("Account has been created successfully").build();
        return new ResponseEntity<>(registerResponse, HttpStatus.OK);
    }

    @PostMapping("/login")
    @Operation(summary = "User login",
            description = "Authenticates the user and returns a JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged in successfully and token is returned."),
            @ApiResponse(responseCode = "401", description = "Invalid credentials (username or password).")
    })
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        LoginResponse loginResponse = LoginResponse.builder()
                .message("User logged in successfully")
                .token(token).build();
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user details",
            description = "Retrieves the principal's details (email, role, ID) using the active JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user claims."),
            @ApiResponse(responseCode = "401", description = "Authentication token is missing or invalid.")
    })
    public ResponseEntity<Map> getCurrentUser(@AuthenticationPrincipal JobPortalUserPrincipal principal){
        if (principal == null) throw new AccessDeniedException("Invalid token");

        Map<String, String> claims = authService.getDetailsOfUser(principal);
        return new ResponseEntity<>(claims, HttpStatus.OK);
    }

    @GetMapping("/refresh-token")
    @Operation(summary = "Refresh JWT token",
            description = "Generates a new JWT token using a valid, non-expired token. Useful for extending session without re-logging.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "New token generated successfully."),
            @ApiResponse(responseCode = "401", description = "Authentication token is missing or invalid.")
    })
    public ResponseEntity<LoginResponse> refreshToken(@AuthenticationPrincipal JobPortalUserPrincipal principal) {
        if (principal == null) throw new AccessDeniedException("Invalid token");

        String refreshedToken = jwtutil.generateToken(principal.getUsername());
        LoginResponse loginResponse = LoginResponse.builder()
                .token(refreshedToken).build();
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
}