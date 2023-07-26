package com.spoon.sok.domain.email.controller;

import com.spoon.sok.domain.email.dto.EmailAuthVerifyDto;
import com.spoon.sok.domain.email.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/auth")
    public ResponseEntity<?> sendAuthEmail(@RequestParam("email") String email) throws MessagingException {
        return emailService.sendAuthEmail(email);
    }

    @GetMapping("/find")
    public ResponseEntity<?> sendFindPassEmail(@RequestParam("email") String email) throws MessagingException {
        return emailService.sendFindPassEmail(email);
    }

    @PostMapping("/auth")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailAuthVerifyDto requestDto) {
        return emailService.verify(requestDto);
    }
}