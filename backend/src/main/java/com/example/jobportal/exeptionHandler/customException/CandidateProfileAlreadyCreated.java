package com.example.jobportal.exeptionHandler.customException;

public class CandidateProfileAlreadyCreated extends RuntimeException {
    public CandidateProfileAlreadyCreated(String message) {
        super(message);
    }
    public CandidateProfileAlreadyCreated() {}
}
