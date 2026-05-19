package com.example.jobportal.exeptionHandler.customException;

public class CompanyAlreadyRegisterByUser extends RuntimeException{
    public CompanyAlreadyRegisterByUser(String message){
        super(message);
    }
    public CompanyAlreadyRegisterByUser(){}
}
