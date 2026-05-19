package com.example.jobportal.exeptionHandler;

import com.example.jobportal.exeptionHandler.customException.*;
import com.example.jobportal.exeptionHandler.dto.ErrorMessage;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorMessage> duplicateKeyException(DuplicateKeyException e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.CONFLICT)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(JobPostNotFound.class)
    public ResponseEntity<ErrorMessage> jobPostNotFoundException(JobPostNotFound e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExist.class)
    public ResponseEntity<ErrorMessage> userAlreadyExist(UserAlreadyExist e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.CONFLICT)
                .timestamp(new Date(System.currentTimeMillis()))
                .build();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessage> illegalArgumentException(IllegalArgumentException e) {

        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.BAD_REQUEST)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CandidateProfileNotCreated.class)
    public ResponseEntity<ErrorMessage> candidateProfileNotCreatedException(CandidateProfileNotCreated e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.FORBIDDEN)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ApplicationNotApplied.class)
    public ResponseEntity<ErrorMessage> applicationNotApplied(ApplicationNotApplied e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build();
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<ErrorMessage> handleInvalidCredentials(InvalidCredentials e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build();
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CompanyNotFound.class)
    public ResponseEntity<ErrorMessage> handleCompanyNotFound(CompanyNotFound ex){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build();
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CompanyAlreadyRegisterByUser.class)
    public ResponseEntity<ErrorMessage> handleCompanyAlreadyRegisterByUser(CompanyAlreadyRegisterByUser ex){

        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(ex.getMessage())
                .status(HttpStatus.CONFLICT)
                .timestamp(new Date(System.currentTimeMillis()))
                .build();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(CandidateProfileAlreadyCreated.class)
    public ResponseEntity<ErrorMessage> handleCandidateProfileAlreadyCreated(CandidateProfileAlreadyCreated e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.CONFLICT)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ApplicationAlreadySubmited.class)
    public ResponseEntity<ErrorMessage> handleApplicationAlreadySubmitted(ApplicationAlreadySubmited e){
        ErrorMessage errorMessage = ErrorMessage.builder()
                .message(e.getMessage())
                .status(HttpStatus.CONFLICT)
                .timestamp(new Date(System.currentTimeMillis())).build();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }
}
