package com.example.jobportal.messaging.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    private String senderId;
    private String content;
    private LocalDateTime timestamp;

    public Message(String senderId, String content) {
        this.senderId = senderId;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
}
