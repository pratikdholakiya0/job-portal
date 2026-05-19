package com.example.jobportal.user.repository;

import com.example.jobportal.user.entity.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    Profile getProfileByEmail(String email);

    Profile getProfileByUserId(String userId);

    Profile getProfileById(String id);
}
