package com.example.jobportal.exeptionHandler.customException;

public class ApplicationNotApplied extends RuntimeException {
    public ApplicationNotApplied(String message) {
        super(message);
    }
    public ApplicationNotApplied() {}
}
