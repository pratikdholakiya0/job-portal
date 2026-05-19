package com.example.jobportal.exeptionHandler.customException;

public class UserNotFound extends RuntimeException{
    public UserNotFound(String message){
        super(message);
    }
    public UserNotFound(){}
}
