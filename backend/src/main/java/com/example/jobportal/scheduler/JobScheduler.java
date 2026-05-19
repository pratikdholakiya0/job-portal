package com.example.jobportal.scheduler;

import com.example.jobportal.job.entity.JobPosting;
import com.example.jobportal.job.repository.JobPostingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class JobScheduler {
    @Autowired
    private JobPostingRepository  jobPostingRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void scheduled() {
        List<JobPosting> jobsActiveAndExpired = jobPostingRepository.getAllByActiveAndDeadlineAfter(true, new Date(System.currentTimeMillis()));

        if (jobsActiveAndExpired.isEmpty()) {
            return;
        }
        jobsActiveAndExpired.forEach(jobPosting -> {
            jobPosting.setActive(false);
        });

        jobPostingRepository.saveAll(jobsActiveAndExpired);
    }
}
