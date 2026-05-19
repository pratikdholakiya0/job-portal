package com.example.jobportal.messaging.repository;

import com.example.jobportal.messaging.entity.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    Conversation getConversationById(String id);

    Conversation getConversationByEmployerIdOrApplicantId(String employerId, String applicantId);

    Conversation getConversationsByEmployerIdOrApplicantId(String employerId, String applicantId);

    List<Conversation> getAllByEmployerIdOrApplicantId(String employerId, String applicantId);
}
