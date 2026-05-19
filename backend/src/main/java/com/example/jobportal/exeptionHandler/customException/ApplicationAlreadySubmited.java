package com.example.jobportal.exeptionHandler.customException;

public class ApplicationAlreadySubmited extends RuntimeException {
    public ApplicationAlreadySubmited(String message) {
        super(message);
    }
    public ApplicationAlreadySubmited() {}
}
