package com.example.jobportal.application.service;

import com.example.jobportal.application.dto.ApplicationStatusUpdate;
import com.example.jobportal.application.dto.ApplicationSubmissionRequest;
import com.example.jobportal.application.entity.Application;
import com.example.jobportal.application.entity.ApplicationActivity;
import com.example.jobportal.application.enums.ApplicationStatus;
import com.example.jobportal.application.repository.ApplicationActivityRepository;
import com.example.jobportal.application.repository.ApplicationRepository;
import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.exeptionHandler.customException.ApplicationAlreadySubmited;
import com.example.jobportal.exeptionHandler.customException.ApplicationNotApplied;
import com.example.jobportal.exeptionHandler.customException.CandidateProfileNotCreated;
import com.example.jobportal.exeptionHandler.customException.JobPostNotFound;
import com.example.jobportal.job.entity.JobPosting;
import com.example.jobportal.job.repository.JobPostingRepository;
import com.example.jobportal.messaging.service.ConversationService;
import com.example.jobportal.user.enums.Role;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationActivityRepository applicationActivityRepository;
    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ConversationService conversationService;

    public ApplicationService(ApplicationActivityRepository applicationActivityRepository, ApplicationRepository applicationRepository,
                              JobPostingRepository jobPostingRepository, ConversationService conversationService) {
        this.applicationActivityRepository = applicationActivityRepository;
        this.applicationRepository = applicationRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.conversationService = conversationService;
    }

    public List<Application> getApplicationsByCandidate(JobPortalUserPrincipal principal, int page, int size) {
        String resumeId = principal.getResumeId();
        if (resumeId==null) throw new CandidateProfileNotCreated("Candidate Profile Not Created yet. Please complete your resume profile.");

        String userId = principal.getUserId();
        Sort sort = Sort.by(Sort.Direction.DESC, "applicationDate");

        Pageable pageable = PageRequest.of(page, size, sort);
        List<Application> applications = applicationRepository.getApplicationsByUserId(userId, pageable);
        if(applications == null || applications.isEmpty()) throw new ApplicationNotApplied("User have not applied to any application");
        return applications;
    }

    @Transactional
    public void applyToJob(ApplicationSubmissionRequest  request, JobPortalUserPrincipal principal) {
        String userId = principal.getUserId();
        String resumeId = principal.getResumeId();

        if (resumeId == null) throw new CandidateProfileNotCreated("Candidate profile not created");

        JobPosting jobPosting = jobPostingRepository.findJobPostingById(request.getJobId());
        if (jobPosting == null) throw new JobPostNotFound("There is no job post with id : " + request.getJobId());

        Application application = applicationRepository.findApplicationByUserIdAndJobId(userId, request.getJobId());
        if (application != null) throw new ApplicationAlreadySubmited("You have already applied to this job.");

        application = Application.builder()
                .userId(userId)
                .companyId(jobPosting.getCompanyId())
                .jobId(request.getJobId())
                .jobTitle(jobPosting.getTitle())
                .coverLetterText(request.getCoverLetterText())
                .applicationDate(new Date(System.currentTimeMillis()))
                .status(ApplicationStatus.APPLIED)
                .build();

        Application savedApplication = applicationRepository.save(application);

        conversationService.createConversation(principal, application);

        logApplicationActivity(savedApplication.getId(), ApplicationStatus.APPLIED, Role.APPLICANT, "Application submitted successfully.");
    }

    public List<Application> getApplicationsByEmployer(JobPortalUserPrincipal principal) {
        String employerCompanyId = principal.getCompanyId();
        if (employerCompanyId == null)  throw new AccessDeniedException("Access denied: You must be associated with a company profile to view applications.");
        return applicationRepository.findAllByCompanyId(employerCompanyId);
    }

    public List<ApplicationActivity> getApplicationHistory(String applicationId, JobPortalUserPrincipal principal) {
        Application application = applicationRepository.getApplicationsById(applicationId);
        if (application==null) throw new ApplicationNotApplied("Application does not exist");
        if (!application.getUserId().equals(principal.getUserId())) throw new AccessDeniedException("You do not have permission to view application history.");
        return applicationActivityRepository.findAllByApplicationIdOrderByTimestampAsc(applicationId);
    }

    public void updateApplicationStatus(ApplicationStatusUpdate applicationStatusUpdate, JobPortalUserPrincipal principal) {
        String userId = principal.getUserId();
        String employerCompanyId = principal.getCompanyId();
        Role role = principal.getRole();

        Application application = applicationRepository.findApplicationById(applicationStatusUpdate.getApplicationId());
        if (application==null) throw new ApplicationNotApplied("Application does not exist");

        ApplicationStatus newStatus = applicationStatusUpdate.getNewStatus();
        boolean permissionGranted = false;

        if (role.equals(Role.ADMIN)) {
            permissionGranted = true;
        } else if (newStatus.equals(ApplicationStatus.WITHDRAWN)) {
            if (role.equals(Role.APPLICANT) && application.getUserId().equals(userId)) {
                permissionGranted = true;
            }
        } else if (role.equals(Role.EMPLOYER)) {
            if (application.getCompanyId().equals(employerCompanyId)) {
                permissionGranted = true;
            }
        }

        if (!permissionGranted) {
            throw new AccessDeniedException("Access denied: You do not have permission to modify the status of this application.");
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(applicationStatusUpdate.getNewStatus());
        applicationRepository.save(application);
        logApplicationActivity(applicationStatusUpdate.getApplicationId(), newStatus, Role.EMPLOYER,
                String.format("Status changed from %s to %s.", oldStatus, newStatus.name()));
    }

    private void logApplicationActivity(String applicationId, ApplicationStatus status, Role changedBy, String note) {
        ApplicationActivity activity = ApplicationActivity.builder()
                .applicationId(applicationId)
                .status(status)
                .statusChangedBy(changedBy)
                .timestamp(new Date(System.currentTimeMillis()))
                .note(note)
                .build();
        applicationActivityRepository.save(activity);
    }

    public Application getApplicationById(String applicationId) {
        Application application = applicationRepository.findApplicationById(applicationId);
        if (application == null) throw new ApplicationNotApplied("Application does not exist");
        return application;
    }
}
