package com.example.jobportal.application.repository;

import com.example.jobportal.application.entity.Application;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {


    List<Application> findAllByCompanyId(String companyId);

    Application findApplicationById(String id);

    List<Application> getApplicationsByUserId(String userId, Pageable pageable);

    Application getApplicationsById(String id);

    Application findApplicationByUserIdAndJobId(String userId, String jobId);
}
