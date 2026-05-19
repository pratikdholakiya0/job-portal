package com.example.jobportal.candidate.service;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.candidate.entity.Resume;
import com.example.jobportal.candidate.repository.ResumeRepository;
import com.example.jobportal.exeptionHandler.customException.CandidateProfileAlreadyCreated;
import com.example.jobportal.exeptionHandler.customException.CandidateProfileNotCreated;
import com.example.jobportal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {
    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    public Resume createCandidateProfile(Resume resume, JobPortalUserPrincipal principal) {
        String userId = principal.getUserId();
        String resumeId = resume.getId();
        if (resumeId != null) throw new CandidateProfileAlreadyCreated("Candidate Profile has benn Already Created");
        resume.setUserId(userId);

        return resumeRepository.save(resume);
    }

    public Resume updateResume(Resume resume, JobPortalUserPrincipal principal) {
        String userId = principal.getUserId();
        String resumeId = principal.getResumeId();

        if (resumeId == null) throw new CandidateProfileNotCreated("Candidate profile is not created yet of user : "+ userId);

        Resume resumeEntity = resumeRepository.findCandidateProfileByUserId(userId);
        if (resume.getBio() != null) resumeEntity.setBio(resume.getBio());
        if (resume.getEducationList() != null) resumeEntity.setEducationList(resume.getEducationList());
        if (resume.getSkillList() != null) resumeEntity.setSkillList(resume.getSkillList());
        if (resume.getExperienceList() != null) resumeEntity.setExperienceList(resume.getExperienceList());
        if (resume.getGithub() != null) resumeEntity.setGithub(resume.getGithub());
        if (resume.getTwitter() != null) resumeEntity.setTwitter(resume.getTwitter());
        if (resume.getLinkedin() != null) resumeEntity.setLinkedin(resume.getLinkedin());
        if (resume.getPortfolio() != null) resumeEntity.setPortfolio(resume.getPortfolio());

        return resumeRepository.save(resumeEntity);
    }

    public Resume getResume(JobPortalUserPrincipal principal) {
        String resumeId = principal.getResumeId();
        if (resumeId==null) throw new CandidateProfileNotCreated("candidate profile is not created");
        return resumeRepository.getResumeById(resumeId);
    }
}
