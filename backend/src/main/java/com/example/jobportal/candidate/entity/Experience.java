package com.example.jobportal.candidate.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Experience {
    private String companyName;
    private String jobTitle;
    private Date startDate;
    private Date endDate;
    private String description;
}