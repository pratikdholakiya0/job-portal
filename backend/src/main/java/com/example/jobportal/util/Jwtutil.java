package com.example.jobportal.util;

import com.example.jobportal.candidate.entity.Resume;
import com.example.jobportal.candidate.repository.ResumeRepository;
import com.example.jobportal.company.entity.Company;
import com.example.jobportal.company.repository.CompanyRepository;
import com.example.jobportal.user.entity.Profile;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.user.repository.ProfileRepository;
import com.example.jobportal.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class Jwtutil {

    @Value("${application.security.jwt.secret-key}")
    private String JWT_SECRET;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public String generateToken(String username){
        Map<String, Object> claims = generateClaims(username);

        // CRITICAL: Prevent token creation if the user or essential data wasn't found.
        if (claims.isEmpty() || !claims.containsKey("userId")) {
            throw new IllegalArgumentException("Cannot generate token: User not found or essential claims are missing for: " + username);
        }

        return createToken(claims, username);
    }

    public Map<String, Object> generateClaims(String username){
        Map<String, Object> claims = new HashMap<>();

        // 1. CRITICAL: Check if User exists first to prevent NPE
        User user = userRepository.findUserByEmail(username);
        if (user == null) {
            return claims; // Return empty map if user not found.
        }

        // Add mandatory essential claims (for JwtFilter)
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name()); // Crucial for JwtFilter authorization

        // 2. Safely retrieve optional profile IDs (use null for missing profiles)

        Profile profile = profileRepository.getProfileByUserId(user.getId());
        claims.put("profileId", profile != null ? profile.getId() : null);
        claims.put("name", profile!=null ? profile.getFirstName()+" "+profile.getLastName() : "");

        // Map candidateProfileId to resumeId claim
        Resume resume = resumeRepository.getResumeByUserId(user.getId());
        claims.put("resumeId", resume != null ? resume.getId() : null);

        Company company = companyRepository.findCompanyByUserId(user.getId());
        claims.put("companyId", company != null ? company.getId() : null);

        return claims;
    }

    private String createToken(Map<String, Object> claims, String username){
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token){
        return extractAllClaims(token).getExpiration();
    }

    public boolean isExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean isValid(String token){
        return !isExpired(token);
    }

    public SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
    }
}