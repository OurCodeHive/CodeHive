package com.spoon.sok.domain.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;

    public ResponseEntity<?> sendAuthCode(String email) throws MessagingException {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        if (!email.contains("@")) {
            result.put("status", 400);
            result.put("message", "올바른 이메일 형식이 아닙니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        String code = createCode();

        try {
            MimeMessage message = emailSender.createMimeMessage();

            message.addRecipients(MimeMessage.RecipientType.TO, email);
            message.setSubject("[CodeHive] 회원가입 인증코드를 보내드립니다.");
            message.setText(setContext(code), "utf-8", "html");

            emailSender.send(message);

            result.put("status", 200);
            result.put("message", "성공적으로 회원가입 인증코드를 전송하였습니다.");
            status = HttpStatus.OK;
        } catch (Exception e) {
            result.put("status", 400);
            result.put("message", "메일 전송에 실패하였습니다.");
            status = HttpStatus.BAD_REQUEST;
        }

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

    private String setContext(String code) {
        Context context = new Context();
        context.setVariable("code", code);
        return templateEngine.process("authCode", context);
    }
}
