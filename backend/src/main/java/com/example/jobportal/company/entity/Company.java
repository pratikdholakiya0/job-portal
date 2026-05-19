package com.example.jobportal.company.entity;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "company")
public class Company {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String userId;

    @NotBlank
    private String name;

    private String industry;
    private String headquarters;
    private String size;

    private String description;
    @NotBlank
    private String address;

    private String website;
    private String logoFileUrl;
}
