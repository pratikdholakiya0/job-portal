package com.example.jobportal.messaging.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageReq {
    private String conversationId;
    private String senderId;
    private String content;
}
