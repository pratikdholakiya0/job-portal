package com.example.jobportal.job.service;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.repository.CompanyRepository;
import com.example.jobportal.exeptionHandler.customException.CompanyNotFound;
import com.example.jobportal.exeptionHandler.customException.JobPostNotFound;
import com.example.jobportal.job.dto.JobPostingDto;
import com.example.jobportal.job.entity.JobPosting;
import com.example.jobportal.job.repository.JobPostingRepository;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JobPostingService {
    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public JobPosting createJobPosting(JobPostingDto jobPostingDto, JobPortalUserPrincipal principal) {
        String companyId = principal.getCompanyId();

        if (companyId == null) throw new CompanyNotFound("This user does not own any company");

        Company company = companyRepository.findById(companyId).get();
        JobPosting jobPosting = JobPosting.builder()
                .companyId(companyId)
                .title(jobPostingDto.getTitle())
                .description(jobPostingDto.getDescription())
                .locationType(jobPostingDto.getLocationType())
                .companyName(company.getName())
                .city(jobPostingDto.getCity())
                .employmentType(jobPostingDto.getEmploymentType())
                .salaryRange(jobPostingDto.getSalaryRange())
                .requiredSkill(jobPostingDto.getRequiredSkill())
                .postedDate(new Date(System.currentTimeMillis()))
                .deadline(jobPostingDto.getDeadline())
                .isActive(true)
                .isApproved(false)
                .build();
        return jobPostingRepository.save(jobPosting);
    }

    public JobPosting updateJobPosting(String jobId,JobPostingDto jobPostingDto, JobPortalUserPrincipal principal) {
        String companyId = principal.getCompanyId();

        JobPosting jobPosting = jobPostingRepository.findJobPostingById(jobId);
        if (jobPosting == null) throw new JobPostNotFound("Job posting not found");

        if (!jobPosting.getCompanyId().equals(companyId)){
            throw new AccessDeniedException("You are not authorized to update this job posting.");
        }

        if (jobPostingDto.getTitle()!=null) jobPosting.setTitle(jobPostingDto.getTitle());
        if (jobPostingDto.getDescription()!=null) jobPosting.setDescription(jobPostingDto.getDescription());
        if (jobPostingDto.getLocationType()!=null) jobPosting.setLocationType(jobPostingDto.getLocationType());
        if (jobPostingDto.getCity()!=null) jobPosting.setCity(jobPostingDto.getCity());
        if (jobPostingDto.getEmploymentType()!=null) jobPosting.setEmploymentType(jobPostingDto.getEmploymentType());
        if (jobPostingDto.getRequiredSkill()!=null) jobPosting.setRequiredSkill(jobPostingDto.getRequiredSkill());
        if (jobPostingDto.getSalaryRange()!=null) jobPosting.setSalaryRange(jobPostingDto.getSalaryRange());
        if (jobPosting.getDeadline()==null || !jobPostingDto.getDeadline().equals(jobPosting.getDeadline())) {
            jobPosting.setDeadline(jobPostingDto.getDeadline());
            jobPosting.setApproved(false);
        }

        return jobPostingRepository.save(jobPosting);
    }

    public List<JobPosting> findAllJobsByUser(JobPortalUserPrincipal principal) {
        String companyId = principal.getCompanyId();
        return jobPostingRepository.getAllByCompanyId(companyId);
    }

    public JobPosting findJobPostById(String id) {
        JobPosting jobPosting = jobPostingRepository.getJobPostingById(id);
        if (jobPosting == null) throw new JobPostNotFound("Job post with id : " + id + " not found");
        return jobPosting;
    }

    public List<JobPosting> getRecentJobs(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "postedDate");
        Pageable pageable = PageRequest.of(page, size, sort);
        List<JobPosting> jobs = jobPostingRepository.getAllByActiveAndDeadlineAfterAndApproved(true, true, new Date());
        if (jobs == null) throw new JobPostNotFound("Job posting not found");
        return jobs;
    }
}
