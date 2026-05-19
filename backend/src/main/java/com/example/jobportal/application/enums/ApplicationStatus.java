package com.example.jobportal.application.enums;

public enum ApplicationStatus {
    APPLIED,       // Candidate has submitted the application
    UNDER_REVIEW,  // Employer has acknowledged the application
    SHORTLISTED,   // Application selected for further evaluation
    INTERVIEWING,  // Candidate is currently in the interview process
    OFFER_EXTENDED, // Job offer has been made
    HIRED,         // Candidate accepted the offer
    REJECTED,      // Application was declined
    WITHDRAWN      // Candidate withdrew the application
}
