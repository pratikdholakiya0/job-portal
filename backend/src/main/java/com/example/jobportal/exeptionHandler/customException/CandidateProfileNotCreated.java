package com.example.jobportal.exeptionHandler.customException;

public class CandidateProfileNotCreated extends RuntimeException {
    public CandidateProfileNotCreated(String message) {
        super(message);
    }
    public CandidateProfileNotCreated() {}
}
