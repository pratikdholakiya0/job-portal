package com.example.jobportal.candidate.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Education {
    private String institutionName;
    private String degree;
    private String fieldOfStudy;
    private Date startDate;
    private Date endDate;
    private String gradeOrGPA;
}
