package com.spoon.sok.domain.email.service;

import com.spoon.sok.domain.email.dto.EmailAuthVerifyDto;
import com.spoon.sok.domain.email.entity.Email;
import com.spoon.sok.domain.email.repository.EmailRepository;
import com.spoon.sok.domain.study.repository.StudyRepository;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;
    private final SpringTemplateEngine templateEngine;

    private final UserRepository userRepository;
    private final EmailRepository emailRepository;
    private final StudyRepository studyRepository;

    public ResponseEntity<?> sendAuthEmail(String email) throws MessagingException {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        if (!email.contains("@")) {
            result.put("status", 400);
            result.put("message", "올바른 이메일 형식이 아닙니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        Optional<User> user = userRepository.findByEmail(email);

        if (!user.isEmpty()) {
            result.put("status", 400);
            result.put("message", "이미 가입한 이메일 입니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        String code = createCode();

        try {
            MimeMessage message = emailSender.createMimeMessage();

            message.addRecipients(MimeMessage.RecipientType.TO, email);
            message.setSubject("[CodeHive] 이메일 인증");
            message.setText(setContext(code, "authEmail"), "utf-8", "html");

            emailSender.send(message);

            Email emailAuth = Email.builder()
                    .email(email)
                    .authCode(code)
                    .limitTime(LocalDateTime.now().plusMinutes(3))
                    .isauth(0)
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

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            result.put("status", 400);
            result.put("message", "등록되지 않는 이메일 입니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

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
                    .isauth(0)
                    .build();

            System.out.println(LocalDateTime.now().plusMinutes(3));

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

    @Transactional
    public ResponseEntity<?> verify(EmailAuthVerifyDto requestDto) {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        Optional<Email> verifyEmail = emailRepository.findByNewestCode(requestDto.getEmail());

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

            verifyEmail.get().updateIsAuth(1);

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

    public void sendInviteLinkEmail(Long studyinfo_id, String email, Long userstudy_id) throws MessagingException {
        StringBuilder sb = new StringBuilder();
        Map<String, Object> result = new HashMap<>();

        // Email로 user_id를 찾았다.
        Optional<User> user = userRepository.findByEmail(email);

        sb.append("http://localhost:8080/test?studyinfo_id=").append(studyinfo_id);

        if (!user.isPresent()) {
            sb.append("&").append("users_id=null");
        } else {
            sb.append("&").append("users_id=").append(user.get().getId());
        }
        sb.append("&").append("userstudy_id=").append(userstudy_id);
        sb.append("&").append("invite_email=").append(email);
        log.info("이메일에 첨부될 링크 : {}", sb.toString());

        MimeMessage message = emailSender.createMimeMessage();
        message.addRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("[CodeHive] 스터디 초대 링크");
        message.setText(setContext(sb.toString(), "inviteEmail"), "utf-8", "html");

        emailSender.send(message);
    }
}
