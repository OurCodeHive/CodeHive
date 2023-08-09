package com.spoon.sok.domain.email.controller;

import com.spoon.sok.domain.email.dto.EmailAuthVerifyDto;
import com.spoon.sok.domain.email.service.EmailService;
import com.spoon.sok.domain.email.dto.InviteEmailDto;
import com.spoon.sok.domain.study.service.StudyService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {
    private final EmailService emailService;
    private final StudyService studyService;

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

    // 스터디 초대 이메일 발송
    // http://localhost:8080/api/email/study/invite
    @PostMapping("/study/invite")
    public ResponseEntity<?> sendInviteEmail(@RequestBody InviteEmailDto inviteEmailDto) {
        // 초대할 이메일 여러개를 받음
        List<String> inviteList = inviteEmailDto.getEmail();

        Map<String, Object> response = new HashMap<>();

        try {
            for (String email : inviteList) {
                // 1. 중간테이블에 저장
                Long userstudy_id = studyService.setUserStudyForEmail(inviteEmailDto.getStudyinfoId(), email);

                // 2. 이메일 발송
                emailService.sendInviteLinkEmail(inviteEmailDto.getStudyinfoId(), email, userstudy_id);
            }
        } catch (MessagingException e) {
            log.info("이메일 전송에 실패하였습니다.");

            response.put("status", 400);
            response.put("message", "이메일 전송에 실패하였습니다.");

            e.printStackTrace();
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }

        response.put("status", 200);
        response.put("message", "전송완료");

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }
}