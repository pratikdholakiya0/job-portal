package com.example.jobportal.exeptionHandler.customException;

public class CompanyNotFound extends RuntimeException {
    public CompanyNotFound(String message) {
        super(message);
    }
    public CompanyNotFound() {}
}
