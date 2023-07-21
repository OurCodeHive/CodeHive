package com.spoon.sok.domain.email.service;

import com.spoon.sok.domain.email.dto.EmailAuthVerifyDto;
import com.spoon.sok.domain.email.entity.Email;
import com.spoon.sok.domain.email.repository.EmailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;

    //    private final UserRepository userRepository;
    private final EmailRepository emailRepository;

    public ResponseEntity<?> sendAuthEmail(String email) throws MessagingException {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        if (!email.contains("@")) {
            result.put("status", 400);
            result.put("message", "올바른 이메일 형식이 아닙니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

//        Optional<User> user = userRepository.findByEmail(email);
//
//        if (user.isEmpty()) {
//            result.put("status", 400);
//            result.put("message", "이미 가입한 이메일 입니다.");
//            status = HttpStatus.BAD_REQUEST;
//
//            return new ResponseEntity<Map<String, Object>>(result, status);
//        }

        String code = createCode();

        try {
            MimeMessage message = emailSender.createMimeMessage();

            message.addRecipients(MimeMessage.RecipientType.TO, email);
            message.setSubject("[CodeHive] 회원가입 인증");
            message.setText(setContext(code, "authEmail"), "utf-8", "html");

            emailSender.send(message);

            Email emailAuth = Email.builder()
                    .email(email)
                    .authCode(code)
                    .limitTime(LocalDateTime.now().plusMinutes(3))
                    .build();

            emailRepository.save(emailAuth);

            result.put("status", 200);
            result.put("message", "성공적으로 회원가입 인증메일을 전송하였습니다.");
            status = HttpStatus.OK;
        } catch (Exception e) {
            result.put("status", 400);
            result.put("message", "메일 전송에 실패하였습니다.");
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

    public ResponseEntity<?> sendFindPassEmail(String email) {
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
            message.setSubject("[CodeHive] 비밀번호 찾기 인증");
            message.setText(setContext(code, "passEmail"), "utf-8", "html");

            emailSender.send(message);

            Email emailAuth = Email.builder()
                    .email(email)
                    .authCode(code)
                    .limitTime(LocalDateTime.now().plusMinutes(3))
                    .build();

            emailRepository.save(emailAuth);

            result.put("status", 200);
            result.put("message", "성공적으로 비밀번호 찾기 인증메일을 전송하였습니다.");
            status = HttpStatus.OK;
        } catch (Exception e) {
            result.put("status", 400);
            result.put("message", "메일 전송에 실패하였습니다.");
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

    public ResponseEntity<?> verify(EmailAuthVerifyDto requestDto) {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        Optional<Email> verifyEmail = emailRepository.findByNewestCode(requestDto.getEmail(), requestDto.getAuthCode());

        if (verifyEmail.isEmpty()) {
            result.put("status", 400);
            result.put("message", "올바른 접근이 아닙니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        if (verifyEmail.get().getLimitTime().isBefore(LocalDateTime.now())) {
            result.put("status", 400);
            result.put("message", "인증 시간이 만료되었습니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        if (verifyEmail.get().getEmail().equals(requestDto.getEmail())
                && verifyEmail.get().getAuthCode().equals(requestDto.getAuthCode())) {
            result.put("status", 200);
            result.put("message", "이메일 인증이 완료되었습니다.");
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(result, status);
        } else {
            result.put("status", 400);
            result.put("message", "코드가 일치하지 않습니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }
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

    private String setContext(String code, String template) {
        Context context = new Context();
        context.setVariable("code", code);

        return templateEngine.process(template, context);
    }
}
