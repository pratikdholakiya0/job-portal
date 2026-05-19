package com.example.jobportal.company.repository;

import com.example.jobportal.company.entity.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {
    Company findCompanyByUserId(String userId);

    Company getCompaniesByUserId(String userId);

    Company findCompanyById(String id);

    Company getCompanyById(String id);
}
