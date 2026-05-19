package com.example.jobportal.company.service;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.repository.CompanyRepository;
import com.example.jobportal.exeptionHandler.customException.CompanyAlreadyRegisterByUser;
import com.example.jobportal.exeptionHandler.customException.CompanyNotFound;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public void createCompany(Company company, JobPortalUserPrincipal principal){
        String userId = principal.getUserId();
        String companyId = principal.getCompanyId();
        if(companyId!=null) throw new CompanyAlreadyRegisterByUser("Employer already has a registered company profile. Only one company is allowed per user.");
        company.setUserId(userId);
        companyRepository.save(company);
    }

    public Company getCompany(String id){
        Optional<Company> existingCompany = companyRepository.findById(id);
        if(existingCompany.isPresent()) return existingCompany.get();
        throw new CompanyNotFound("Company not found with this id : " + id);
    }

    public Company getCompanyByUser(JobPortalUserPrincipal principal){
        String companyId = principal.getCompanyId();
        if (companyId == null) throw new CompanyNotFound("User does not have a company profile");
        return companyRepository.findCompanyById(companyId);
    }

    public void updateCompany(Company company, JobPortalUserPrincipal principal){
        String userId = principal.getUserId();
        String companyId = principal.getCompanyId();

        if(companyId == null) throw new CompanyNotFound("Company not found with this id : " + userId);

        Company companyDb = companyRepository.findCompanyById(companyId);

        if (company.getName() != null && !company.getName().isEmpty()) companyDb.setName(company.getName());
        if (company.getDescription() != null && !company.getDescription().isEmpty()) companyDb.setDescription(company.getDescription());
        if (company.getIndustry() != null && !company.getIndustry().isEmpty()) companyDb.setIndustry(company.getIndustry());
        if (company.getSize()!= null && !company.getSize().isEmpty()) companyDb.setSize(company.getSize());
        if (company.getAddress()!= null && !company.getAddress().isEmpty()) companyDb.setAddress(company.getAddress());
        if (company.getWebsite() != null && !company.getWebsite().isEmpty()) companyDb.setWebsite(company.getWebsite());
        if (company.getHeadquarters()!=null && !company.getHeadquarters().isEmpty()) companyDb.setHeadquarters(company.getHeadquarters());
        if (company.getLogoFileUrl()!=null && !company.getLogoFileUrl().isEmpty()) companyDb.setLogoFileUrl(company.getLogoFileUrl());

        companyRepository.save(companyDb);
    }
}
