package com.example.jobportal.messaging.controller;

import com.example.jobportal.messaging.entity.Message;
import com.example.jobportal.messaging.payload.MessageReq;
import com.example.jobportal.messaging.service.ConversationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "Real-Time Chat (WebSocket)", description = "STOMP endpoints for sending and receiving messages in real-time conversations.")
public class ChatController {

    private final ConversationService conversationService;

    public ChatController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    /**
     * @summary Send a new message to a conversation
     * @description Clients send a message to this destination to post a new message to a specific conversation.
     * The resulting Message object is broadcast back to all subscribers of the /topic/conversation/{conversationId}.
     *
     * <p>Client sends to: <code>/app/send-message/{conversationId}</code></p>
     * <p>Clients subscribe to: <code>/topic/conversation/{conversationId}</code></p>
     *
     * @param conversationId The unique ID of the conversation.
     * @param messageReq Payload containing the message content and sender/recipient details.
     * @return The saved Message entity, which is broadcast to subscribers.
     */
    @MessageMapping("/send-message/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}")
    public Message sendMessage(
            @DestinationVariable String conversationId,
            MessageReq messageReq) {

        return conversationService.addMessageAndSave(conversationId, messageReq);
    }
}