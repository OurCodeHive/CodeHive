package com.spoon.sok.domain.email.controller;

import com.spoon.sok.domain.email.dto.EmailAuthVerifyDto;
import com.spoon.sok.domain.email.service.EmailService;
import com.spoon.sok.domain.study.dto.InviteEmailDto;
import com.spoon.sok.domain.study.service.StudyService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@CrossOrigin("*")
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

    @PostMapping("study/invite")
    public void sendInviteEmail(@RequestBody InviteEmailDto inviteEmailDto) {
        List<String> inviteList = inviteEmailDto.getEmail();
        for (String email : inviteList) {
            // 1. 중간테이블에 저장하기 위해 필요한 데이터 (studyinfo_id, users_id)
            Long PK = studyService.setUserStudyForEmail(inviteEmailDto.getStudyinfo_id(), email);
            log.info("중간 테이블 저장 했어!");
            log.info("중간 테이블 PK {}", PK);

//            emailService.sendInviteLinkEmail(inviteEmailDto.getStudyinfo_id(), email, pk);
        }
    }
}