package com.example.jobportal.exeptionHandler.customException;

public class ConversationNotFound extends RuntimeException {
    public ConversationNotFound() {
        super();
    }
    public ConversationNotFound(String message) {
        super(message);
    }
}
