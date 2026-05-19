package com.example.jobportal.filter;

import com.example.jobportal.auth.service.JobPortalUserPrincipal;
import com.example.jobportal.user.enums.Role;
import com.example.jobportal.user.repository.UserRepository;
import com.example.jobportal.user.entity.User;
import com.example.jobportal.util.Jwtutil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private Jwtutil jwtutil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            token = authHeader.substring(7);
            username = jwtutil.extractUsername(token);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            boolean userExist = userRepository.getUserByEmail(username)!=null;
            if (!userExist) {
                filterChain.doFilter(request, response);
                return;
            }
            if (jwtutil.isValid(token)) {

                Claims claims = jwtutil.extractAllClaims(token);

                // --- Claim Retrieval (Null-Safe) ---
                String userId = claims.get("userId", String.class);
                String roleString = claims.get("role", String.class);

                if (userId == null || roleString == null) {
                    filterChain.doFilter(request, response);
                    return;
                }

                String profileId = claims.get("profileId", String.class);
                String resumeId = claims.get("resumeId", String.class);
                String companyId = claims.get("companyId", String.class);
                String name = claims.get("name", String.class);
                Role role = Role.valueOf(roleString);

                boolean requiresRefresh = (role.equals(Role.APPLICANT) && resumeId == null) || (role.equals(Role.EMPLOYER) && companyId == null);

                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));

                // 2. Build the Custom Principal
                JobPortalUserPrincipal principal = new JobPortalUserPrincipal(
                        userId,
                        profileId,
                        resumeId,
                        companyId,
                        username,
                        name,
                        null,
                        role,
                        authorities,
                        requiresRefresh
                );

                // 3. Set Authentication Context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}