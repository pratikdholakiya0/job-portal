package com.example.jobportal.config;

import com.example.jobportal.filter.JwtFilter;
import com.example.jobportal.user.enums.Role;
import com.example.jobportal.user.service.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->req
                        // --- 1. PUBLIC ACCESS (No token required) ---
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/company/getCompany/**").permitAll() // Public company view by ID
                        .requestMatchers(HttpMethod.GET, "/api/v1/jobs/getById/**").permitAll() // Public job view by ID
                        .requestMatchers(HttpMethod.GET, "/api/v1/jobs/getAll").permitAll() // Public job list view


                        // --- 2. EMPLOYER ROLE ACCESS (Write & Management) ---
                        // Company creation, update, and private retrieval
                        .requestMatchers("/api/v1/company/create", "/api/v1/company/update", "/api/v1/company/get").hasRole(Role.EMPLOYER.name())

                        // Job posting, update
                        .requestMatchers("/api/v1/jobs/create", "/api/v1/jobs/update/**").hasRole(Role.EMPLOYER.name())

                        // Application review and status update, viewing applications by employer
                        .requestMatchers("/api/v1/applications/status/update", "/api/v1/applications/by-employer").hasRole(Role.EMPLOYER.name())

                        // --- 3. APPLICANT ROLE ACCESS (Resume & Submission) ---
                        // Resume/Profile creation/management
                        .requestMatchers("/api/v1/resume/**").hasRole(Role.APPLICANT.name())

                        // Application submission and viewing personal applications/history
                        .requestMatchers("/api/v1/applications/submit", "/api/v1/applications/my-applications", "/api/v1/applications/getById/**", "/api/v1/applications/history/**").hasRole(Role.APPLICANT.name())


                        // --- 4. AUTHENTICATED ACCESS (Token required for any logged-in user) ---
                        // Auth user details, token refresh, generic user profile endpoints
                        .requestMatchers("/api/v1/user/**", "/api/v1/auth/me", "/api/v1/auth/refresh-token").authenticated()

                        // Viewing job listings relevant to the user's employer account (GET /jobs/getAllActive)
                        .requestMatchers(HttpMethod.GET, "/api/v1/jobs/getAllActive").authenticated()

                        // Conversation endpoints (allows both parties to access their messages)
                        .requestMatchers("/api/v1/conversation/**").authenticated()
                        .requestMatchers("/chat/**").permitAll()

                        // Fallback: All remaining requests must be authenticated (This line catches anything missed, highly restrictive)
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e->e
                        // 1. Handles 401 Unauthorized (Invalid/Missing Token)
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                {
                                  "status": 401,
                                  "error": "Unauthorized",
                                  "message": "Authentication token is missing or invalid.",
                                  "path": "%s"
                                }
                                """.formatted(request.getRequestURI()));
                        })
                        // 2. Handles 403 Forbidden (Insufficient Role/Permissions)
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            String message = accessDeniedException.getMessage();
                            if (accessDeniedException.getMessage().equals("Access Denied")) message = "You do not have permission to access this resource.";

                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                {
                                  "status": 403,
                                  "error": "Forbidden",
                                  "message": "%s",
                                  "path": "%s"
                                }
                                """.formatted(message ,request.getRequestURI()));
                        })
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration auth) throws Exception {
        return auth.getAuthenticationManager();
    }
}