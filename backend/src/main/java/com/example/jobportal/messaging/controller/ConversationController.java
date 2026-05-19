package com.example.jobportal.messaging.controller;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.messaging.entity.Conversation;
import com.example.jobportal.messaging.entity.Message;
import com.example.jobportal.messaging.service.ConversationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversation")
@Tag(name = "Conversation Management", description = "Endpoints for retrieving conversations and messages for authenticated users.")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/my")
    @Operation(summary = "Get all conversations for the authenticated user",
            description = "Retrieves a list of all conversations the current authenticated user (Applicant or Employer) is a participant in.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved conversations list."),
            @ApiResponse(responseCode = "401", description = "User is not authenticated (Invalid token).")
    })
    public ResponseEntity<List<Conversation>> getConversation(@AuthenticationPrincipal JobPortalUserPrincipal principal) {
        if (principal == null) throw new IllegalArgumentException("User is not authenticated");
        List<Conversation> conversation = conversationService.getConversation(principal);
        return ResponseEntity.ok().body(conversation);
    }

    @GetMapping("/{id}/getMessages")
    @Operation(summary = "Get paginated messages for a specific conversation",
            description = "Retrieves a paginated list of messages within a conversation by its ID. Requires the user to be a participant in the conversation.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved paginated messages."),
            @ApiResponse(responseCode = "401", description = "User is not authenticated (Invalid token)."),
            @ApiResponse(responseCode = "403", description = "Forbidden (User is not a participant in this conversation)."),
            @ApiResponse(responseCode = "404", description = "Conversation not found.")
    })
    public ResponseEntity<List<Message>> getMessages(
            @AuthenticationPrincipal JobPortalUserPrincipal principal,
            @PathVariable String id,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size) {

        List<Message> paginatedMessage = conversationService.getMessages(principal, id, page, size);
        return ResponseEntity.ok().body(paginatedMessage);
    }
}