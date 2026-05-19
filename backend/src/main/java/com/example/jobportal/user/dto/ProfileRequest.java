package com.example.jobportal.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileRequest {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String location;
    private String jobTitle;
    private String bio;
}
