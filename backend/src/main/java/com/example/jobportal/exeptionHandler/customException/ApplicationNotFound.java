package com.example.jobportal.exeptionHandler.customException;

public class ApplicationNotFound extends RuntimeException{
    public ApplicationNotFound() {
        super("Application not found");
    }
    public ApplicationNotFound(String message) {
        super(message);
    }
}
