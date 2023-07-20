package com.spoon.sok.domain.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;

    public ResponseEntity<?> sendAuthCode(String email) throws MessagingException {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        String code = createCode();

        MimeMessage message = emailSender.createMimeMessage();

        message.addRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("[CodeHive] 인증코드를 보내드립니다.");
        message.setText(code, "utf-8");

        emailSender.send(message);

        result.put("status", 200);
        result.put("message", "성공적으로 회원가입 인증코드를 전송하였습니다.");
        status = HttpStatus.OK;

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

    private String createCode() {
        char[] key = new char[6];

        for (int i = 0; i < 6; i++) {
            int index = (int) Math.floor(Math.random() * 2);

            switch (index) {
                case 0: {
                    key[i] = (char) (Math.random() * 10 + '0');
                    break;
                }
                case 1:
                    key[i] = (char) (Math.random() * 26 + 'A');
                    break;
            }
        }

        return new String(key);
    }
}
