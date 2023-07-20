package com.spoon.sok.domain.email.controller;

import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/auth")
    public RequestEntity<> sendAuthCode(@RequestParam("email") String email) {
        return emailService.sendAuthCode(email);
    }
}
