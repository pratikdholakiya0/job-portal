package com.example.jobportal.messaging.service;

import com.example.jobportal.application.entity.Application;
import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.repository.CompanyRepository;
import com.example.jobportal.messaging.entity.Conversation;
import com.example.jobportal.messaging.entity.Message;
import com.example.jobportal.messaging.payload.MessageReq;
import com.example.jobportal.messaging.repository.ConversationRepository;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.repository.ProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final CompanyRepository companyRepository;
    private final ProfileRepository profileRepository;

    public ConversationService(ConversationRepository conversationRepository, CompanyRepository companyRepository, ProfileRepository profileRepository) {
        this.conversationRepository = conversationRepository;
        this.companyRepository = companyRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public void createConversation(JobPortalUserPrincipal principal, Application application) {
        String applicantId = principal.getUserId();
        String applicantName = principal.getName();

        String companyId = application.getCompanyId();
        Company company = companyRepository.getCompanyById(companyId);
        String employerId = company.getUserId();
        String employerName = profileRepository.getProfileByUserId(employerId).getFirstName();

        Conversation conversation = Conversation.builder()
                .applicantId(applicantId)
                .applicantName(applicantName)
                .employerId(employerId)
                .employerName(employerName)
                .applicationId(application.getId())
                .messages(new ArrayList<>())
                .isActive(true)
                .build();

        Message message = Message.builder()
                .content("Job Title : " +application.getJobTitle())
                .senderId(applicantId)
                .timestamp(LocalDateTime.now())
                .build();

        Message message2 = Message.builder()
                .content(application.getCoverLetterText())
                .senderId(applicantId)
                .timestamp(LocalDateTime.now())
                .build();

        conversation.getMessages().add(message);
        conversation.getMessages().add(message2);

        conversationRepository.save(conversation);
    }

    public List<Conversation> getConversation(JobPortalUserPrincipal principal) {
        String userInvolved = principal.getUserId();
        List<Conversation> conversation = conversationRepository.getAllByEmployerIdOrApplicantId(userInvolved, userInvolved);
        if (conversation == null) throw new IllegalArgumentException("Conversation does not exist");
        for (Conversation conversation1 : conversation) {
            conversation1.getMessages().clear();
        }

        return conversation;
    }

    public List<Message> getMessages(JobPortalUserPrincipal principal, String conversationId, int page, int size) {
        Conversation conversation = conversationRepository.getConversationById(conversationId);
        if (conversation == null) throw new IllegalArgumentException("Conversation with id " + conversationId + " does not exist");

        if (!conversation.getApplicantId().equals(principal.getUserId()) && !conversation.getEmployerId().equals(principal.getUserId())) {
            throw new IllegalArgumentException("User is not permitted to view this conversation");
        }

        List<Message> message =  conversation.getMessages();
//        int start = Math.max(0, message.size() * (page - 1) * size);
//        int end = Math.min(message.size(), start + size);
//
//        return message.subList(start, end);
        return message;
    }

    public Message addMessageAndSave(String conversationId, MessageReq messageReq) {

        Conversation conversation = conversationRepository.getConversationById(conversationId);

        if (conversation == null) throw new IllegalArgumentException("Conversation not found");

        Message message = new Message(messageReq.getSenderId(), messageReq.getContent());
        conversation.getMessages().add(message);
        conversationRepository.save(conversation);

        return message;
    }
}
