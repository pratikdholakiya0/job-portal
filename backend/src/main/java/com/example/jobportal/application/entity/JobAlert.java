package com.example.jobportal.application.entity;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "education")
public class JobAlert {
    @Id
    private String id;
    @NotBlank
    private String candidateId;
    private String searchKeywords;
    private String locationFilter;
    private String frequency;
    private Date lastSentDate;
}
