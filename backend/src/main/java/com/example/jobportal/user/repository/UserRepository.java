package com.example.jobportal.user.repository;

import com.example.jobportal.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User getUserByEmail(String email);

    User findUserById(String id);

    User findUserByEmail(String email);
}
