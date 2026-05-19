package com.example.jobportal.user.service;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.candidate.entity.Resume;
import com.example.jobportal.candidate.repository.ResumeRepository;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.repository.CompanyRepository;
import com.example.jobportal.user.entity.Profile;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.enums.Role;
import com.example.jobportal.user.repository.ProfileRepository;
import com.example.jobportal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with this username: " + username);
        }

        String userId = user.getId();
        String profileId = null;
        String companyId = null;
        String resumeId = null;

        // 2. Retrieve Profile and Role-Specific Profiles (DB calls required here)
        Profile profile = profileRepository.getProfileByUserId(userId);
        if (profile != null) {
            profileId = profile.getId();
        }

        if (user.getRole().equals(Role.APPLICANT)) {
            Resume resume = resumeRepository.getResumeByUserId(userId);
            if (resume != null) {
                resumeId = resume.getId();
            }
        }

        if (user.getRole().equals(Role.EMPLOYER)) {
            Company company = companyRepository.getCompaniesByUserId(userId);
            if (company != null) {
                companyId = company.getId();
            }
        }

        // 3. Set Authorities
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        // 4. Build and return the custom Principal
        return JobPortalUserPrincipal.builder()
                .username(username)
                .userId(userId)
                .profileId(profileId)
                .companyId(companyId)
                .resumeId(resumeId)
                .password(user.getPassword()) // Required for password verification during login
                .role(user.getRole())
                .authorities(authorities)
                .build();
    }
}