package com.example.jobportal.exeptionHandler.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Data
@Builder
public class ErrorMessage {
    private String message;
    private HttpStatus status;
    private Date timestamp;
}
