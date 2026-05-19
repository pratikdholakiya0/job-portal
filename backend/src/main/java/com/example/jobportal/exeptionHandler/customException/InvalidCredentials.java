package com.example.jobportal.exeptionHandler.customException;

public class InvalidCredentials extends RuntimeException{
    public InvalidCredentials(String message){
        super(message);
    }
}
