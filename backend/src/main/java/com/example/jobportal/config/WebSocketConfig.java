package com.example.jobportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        /*
            it configures message routing within application

            when message send to "/topic" then broker will brod cast message to all
            other clients which have subscribed to this endpoint ("/topic")
         */

        registry.setApplicationDestinationPrefixes("/app");
        /*
            it is prefixed over spring controller which is annotated with
            @MessageMapping controller

            it sent message to destinations starting with "/app"
            message which sent to method which is annotated with
            @MessageMapping
         */
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")
                .setAllowedOrigins("https://thejobstream.vercel.app",
                        "http://localhost:5173")
                .withSockJS();

        /*
            it is actual endpoint where client will subscribe
         */
    }
}
