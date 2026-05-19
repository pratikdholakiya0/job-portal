package com.example.jobportal.job.entity;

import com.example.jobportal.candidate.entity.Skill;
import com.example.jobportal.company.enums.JobType;
import com.example.jobportal.company.enums.LocationType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "job_post")
public class JobPosting {
    @Id
    private String id;

    @NotBlank
    private String companyId;

    @NotBlank
    private String title;
    private String companyName;
    @NotBlank
    private String description;

    private LocationType locationType;
    private String city;
    private JobType employmentType;
    private String salaryRange;
    private List<String> requiredSkill;

    private Date postedDate;
    private Date deadline;

    private boolean isActive;
    private boolean isApproved;
}
