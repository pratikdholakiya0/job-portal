package com.example.jobportal.exeptionHandler.customException;

public class UserAlreadyExist extends RuntimeException {
    public UserAlreadyExist(String message) {
        super(message);
    }
    public UserAlreadyExist() {
        super("User with this email already exist");
    }
}
