package com.example.jobportal.application.repository;

import com.example.jobportal.application.entity.ApplicationActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationActivityRepository extends MongoRepository<ApplicationActivity, String> {
    List<ApplicationActivity> findAllByApplicationId(String applicationId);

    List<ApplicationActivity> findAllByApplicationIdOrderByTimestampDesc(String applicationId);

    List<ApplicationActivity> findAllByApplicationIdOrderByTimestampAsc(String applicationId);
}
