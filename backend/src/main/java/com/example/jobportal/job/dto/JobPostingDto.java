package com.example.jobportal.job.dto;

import com.example.jobportal.candidate.entity.Skill;
import com.example.jobportal.company.enums.JobType;
import com.example.jobportal.company.enums.LocationType;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class JobPostingDto {
    private String title;
    private String description;
    private LocationType locationType;
    private String city;
    private JobType employmentType;
    private String salaryRange;
    private Date deadline;
    private List<String> requiredSkill;
    private boolean isActive;
    private boolean isApproved;
}
