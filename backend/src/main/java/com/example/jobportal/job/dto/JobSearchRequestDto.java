package com.example.jobportal.job.dto;

import com.example.jobportal.company.enums.JobType;
import com.example.jobportal.company.enums.LocationType;
import lombok.Data;

@Data
public class JobSearchRequestDto {
    private String keyword;
    private LocationType location;
    private JobType employmentType;
    private Integer minSalary;
    private Integer maxSalary;
}
