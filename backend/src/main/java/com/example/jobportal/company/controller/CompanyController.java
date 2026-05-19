package com.example.jobportal.company.controller;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.service.CompanyService;
import com.example.jobportal.user.dto.ResponseMessage;
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
@RequestMapping("/api/v1/company")
@Tag(name = "Company Management", description = "Endpoints for creating, updating, and viewing company details.")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping("/create")
    @Operation(summary = "Create a new company profile",
            description = "Allows an authenticated **EMPLOYER** to register a new company profile linked to their account.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company created successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request or company already exists for the user."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or access is denied).")
    })
    public ResponseEntity<ResponseMessage> create(@RequestBody Company company, @AuthenticationPrincipal JobPortalUserPrincipal principal) {

        if (principal == null) {
            throw new AccessDeniedException("Authentication required to create company.");
        }

        companyService.createCompany(company, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Company created successfully")
                .build();
        return ResponseEntity.ok(responseMessage);
    }

    @PutMapping("/update")
    @Operation(summary = "Update the company profile",
            description = "Allows the authenticated **EMPLOYER** to update the company profile associated with their account.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company updated successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid request data."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or does not own the company profile)."),
            @ApiResponse(responseCode = "404", description = "Company profile not found.")
    })
    public ResponseEntity<ResponseMessage> update(@RequestBody Company company, @AuthenticationPrincipal JobPortalUserPrincipal principal){

        if (principal == null) {
            throw new AccessDeniedException("Authentication required to update company.");
        }

        companyService.updateCompany(company, principal);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .message("Company updated successfully")
                .build();
        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/getCompany/{id}")
    @Operation(summary = "Get company details by ID (Public Access)",
            description = "Allows any user (authenticated or unauthenticated) to retrieve public details of a company by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved company details."),
            @ApiResponse(responseCode = "404", description = "Company not found.")
    })
    public ResponseEntity<Company> getCompany(@PathVariable String id){
        Company company = companyService.getCompany(id);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/get")
    @Operation(summary = "Get the authenticated user's company profile",
            description = "Allows an authenticated **EMPLOYER** to retrieve the company profile linked to their account.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved company details."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not an EMPLOYER or access is denied)."),
            @ApiResponse(responseCode = "404", description = "Company profile not found for the current user.")
    })
    public ResponseEntity<Company> getCompany(@AuthenticationPrincipal JobPortalUserPrincipal principal){

        if (principal == null) {
            throw new AccessDeniedException("Authentication required to retrieve company.");
        }

        Company company = companyService.getCompanyByUser(principal);
        return ResponseEntity.ok(company);
    }
}