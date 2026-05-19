package com.example.jobportal.user.service;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.exeptionHandler.customException.CandidateProfileAlreadyCreated;
import com.example.jobportal.exeptionHandler.customException.CandidateProfileNotCreated;
import com.example.jobportal.user.dto.ProfileRequest;
import com.example.jobportal.user.entity.Profile;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.repository.ProfileRepository;
import com.example.jobportal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Transactional
    public Profile buildProfile(ProfileRequest profile, JobPortalUserPrincipal principal){
        String profileId = principal.getProfileId();
        if (profileId!=null) throw new CandidateProfileAlreadyCreated("Profile has been already created");

        String userId = principal.getUserId();
        User user = userRepository.findUserById(userId);
        user.setActive(true);
        userRepository.save(user);

        Profile profileDb = Profile.builder()
                .userId(user.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .bio(profile.getBio())
                .email(user.getEmail())
                .jobTitle(profile.getJobTitle())
                .location(profile.getLocation())
                .phoneNumber(profile.getPhoneNumber())
                .build();
        return profileRepository.save(profileDb);
    }

    public Profile updateProfile(ProfileRequest profile, JobPortalUserPrincipal principal){
        String profileId = principal.getProfileId();
        if(profileId == null) throw new CandidateProfileNotCreated("Candidate Profile Not Created");

        Profile profileDb = profileRepository.getProfileById(profileId);

        if (profile.getFirstName() == null || !profile.getFirstName().isEmpty()) profileDb.setFirstName(profile.getFirstName());
        if (profile.getLastName() == null || !profile.getLastName().isEmpty()) profileDb.setLastName(profile.getLastName());

        if(profile.getBio() == null || !profile.getBio().isEmpty()) profileDb.setBio(profile.getBio());
        if (profile.getJobTitle() == null || !profile.getJobTitle().isEmpty())  profileDb.setJobTitle(profile.getJobTitle());
        if (profile.getLocation() == null || !profile.getLocation().isEmpty()) profileDb.setLocation(profile.getLocation());
        if (profile.getPhoneNumber() == null || !profile.getPhoneNumber().isEmpty()) profileDb.setPhoneNumber(profile.getPhoneNumber());

        return profileRepository.save(profileDb);
    }

    public Profile getProfile(JobPortalUserPrincipal principal){
        String profileId = principal.getProfileId();
        if(profileId == null) throw new CandidateProfileNotCreated("Candidate Profile Not Created");
        return profileRepository.getProfileById(principal.getProfileId());
    }
}
