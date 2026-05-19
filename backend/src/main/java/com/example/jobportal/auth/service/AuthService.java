package com.example.jobportal.auth.service;

import com.example.jobportal.auth.dto.request.LoginRequest;
import com.example.jobportal.auth.dto.request.RegisterRequest;
import com.example.jobportal.exeptionHandler.customException.InvalidCredentials;
import com.example.jobportal.exeptionHandler.customException.UserAlreadyExist;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.enums.Role;
import com.example.jobportal.user.repository.UserRepository;
import com.example.jobportal.util.Jwtutil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private Jwtutil jwtutil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public void register(RegisterRequest registerRequest) {
        User userDb = userRepository.findUserByEmail(registerRequest.getEmail());
        if(userDb!=null) throw new UserAlreadyExist("User with this email already exist");

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .creationDate(new Date(System.currentTimeMillis()))
                .build();
        userRepository.save(user);
    }

    public String login(LoginRequest loginRequest) {
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword())
            );
        }catch (Exception e){
            throw new InvalidCredentials("Invalid email or password");
        }
        return jwtutil.generateToken(loginRequest.getEmail());
    }

    public Map<String, String> getDetailsOfUser(JobPortalUserPrincipal principal) {
        String userId = principal.getUserId();
        String profileId = principal.getProfileId();
        String companyId = principal.getCompanyId();
        String resumeId = principal.getResumeId();
        String name = principal.getName();
        Role role = principal.getRole();

        Map<String,String> claims = new HashMap<>();
        if (userId!=null) claims.put("userId", userId);
        if (profileId!=null) claims.put("profileId", profileId);
        if (companyId!=null) claims.put("companyId", companyId);
        if (resumeId!=null) claims.put("resumeId", resumeId);
        if (role!=null) claims.put("role", role.toString());
        if (name!=null) claims.put("name", name);

        return claims;
    }
}
