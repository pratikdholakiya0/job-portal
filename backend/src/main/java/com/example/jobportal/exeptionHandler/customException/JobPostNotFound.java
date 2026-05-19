package com.example.jobportal.exeptionHandler.customException;

public class JobPostNotFound extends RuntimeException {
    public JobPostNotFound(String message) {
        super(message);
    }
    public JobPostNotFound() {}
}
