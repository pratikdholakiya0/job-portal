package com.example.jobportal.messaging.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private String employerId;
    private String employerName;

    private String applicantId;
    private String applicantName;

    private String applicationId;
    private List<Message> messages = new ArrayList<>();
    private boolean isActive;
}
