package com.example.jobportal.candidate.dto;

import com.example.jobportal.candidate.entity.Education;
import com.example.jobportal.candidate.entity.Experience;
import lombok.Data;

import java.util.List;

@Data
public class ResumeRequest {
    private String bio;

    private List<Education> educationList;

    private List<Experience> experienceList;
}
