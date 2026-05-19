package com.example.jobportal.job.repository;

import com.example.jobportal.job.entity.JobPosting;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface JobPostingRepository extends MongoRepository<JobPosting,String> {
    JobPosting getJobPostingById(String id);

    JobPosting findJobPostingById(String id);

    List<JobPosting> getAllByCompanyId(String companyId);

    List<JobPosting> findAllBy(Pageable pageable);


    @Query("{ 'isActive' : ?0, 'isApproved' : ?1 , 'deadline' : { '$gt' : ?2 } }")
    List<JobPosting> getAllByActiveAndDeadlineAfterAndApproved(boolean active, boolean approved, Date deadlineBefore);;

    @Query("{ 'isActive' : ?0, 'deadline' : { '$gt' : ?1 } }")
    List<JobPosting> getAllByActiveAndDeadlineAfter(boolean active, Date deadlineBefore);;
}
