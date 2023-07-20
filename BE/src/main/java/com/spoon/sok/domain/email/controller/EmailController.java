package com.spoon.sok.domain.email.controller;

import com.spoon.sok.domain.email.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/auth")
    public ResponseEntity<?> sendAuthCode(@RequestParam("email") String email) throws MessagingException {
        return emailService.sendAuthCode(email);
    }
}
