package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.*;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.study.service.StudyService;
import com.spoon.sok.domain.user.entity.UserStudy;
import com.spoon.sok.util.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudyController {

    private final StudyService studyService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/calendar/study")
    public ResponseEntity<?> getCalendarStudyMeeting(@RequestParam("user") String userId) {
        List<StudyAppointmentDTO> studyMeetingList = studyService.getStudyMeeting(userId);

        Map<String, Object> response = new HashMap<>();

        if (studyMeetingList.size() != 0) {
            response.put("status", 200);
            response.put("calendar", studyMeetingList);
        } else {
            response.put("status", 200);
            response.put("calendar", studyMeetingList);
            response.put("message", "예정된 study가 없습니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @GetMapping("/today/study")
    public ResponseEntity<Map<String, Object>> getTodayStudyMeeting(@RequestParam("today") String today, HttpServletRequest request) {

        Claims token = jwtTokenProvider.parseClaims(request.getHeader("Authorization").substring(7));

        List<StudyAppointmentDTO> todayMeetingList = studyService.getTodayStudyMeeting(today, (String) token.get("users_id"));

        Map<String, Object> response = new HashMap<>();

        if (todayMeetingList.size() != 0) {
            response.put("status", 200);
            response.put("today", todayMeetingList);
        } else {
            response.put("status", 200);
            response.put("today", todayMeetingList);
            response.put("message", "오늘 예정된 스터디가 없습니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @GetMapping("/study")
    public ResponseEntity<Map<String, Object>> getStudyGroup(@RequestParam("user") String userId) {
        List<StudyInfoDto> userStudyGroupProceedingList = studyService.getUserStudyGroupProceeding(userId);
        List<StudyInfoDto> userStudyGroupCloseList = studyService.getUserStudyGroupClose(userId);

        List<StudyInfoDto> mergedList = new ArrayList<>();

        Collections.addAll(mergedList, userStudyGroupProceedingList.toArray(new StudyInfoDto[0]));
        Collections.addAll(mergedList, userStudyGroupCloseList.toArray(new StudyInfoDto[0]));

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("study_list", mergedList);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @GetMapping("/study/search")
    public ResponseEntity<Map<String, Object>> searchStudyGroup(@RequestParam("user") String userId,
                                                                @RequestParam("title") String title) {
        List<StudyInfoDto> userStudyGroupList = studyService.searchUserStudyGroup(userId, title);

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("search", userStudyGroupList);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @PostMapping("/study")
    public ResponseEntity<Map<String, Object>> setStudyGroup(
            @RequestBody StudyCreationDto studyCreationDto, HttpServletRequest request, MultipartFile multipartFile) {

        Claims token = jwtTokenProvider.parseClaims(request.getHeader("Authorization").substring(7));
        studyCreationDto.setUsersId((String) token.get("users_id"));

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("studyinfo_id", studyService.setStudyGroup(studyCreationDto));

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    // 올바르지 않은 접근을 검사
    @GetMapping("/study/invite/pre-check")
    public ResponseEntity<Map<String, Object>> getEnterStudyGroupConditionCheck(
            @RequestParam("userstudy_id") Long userstudy_id) {

        Map<String, Object> response = new HashMap<>();

        Optional<PreCheckUserStudyDto> us = studyService.CheckEnterStudyGroupCondition(userstudy_id);

        if (us.get().getStatus() == CurrentStatus.ACCEPT.toString()) {
            response.put("status", 200);
            response.put("message", "이미 가입한 사람");
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
        }

        if (us.isPresent()) {
            response.put("possible_access", true);             // 초대받은 사람이다.
            if (us.get().getUsersId() == null) {       // 회원가입은 안했다.
                response.put("isOurUser", false);
            } else {
                response.put("isOurUser", true);
            }
        } else {
            response.put("possible_access", false);            // 초대 받은 사람이 아니다.
            response.put("isOurUser", false);          // 회원가입도 안했다.
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @PostMapping("/study/invite")
    public ResponseEntity<?> setMemberStudyGroup(@RequestBody ChangeUserStudyDto changeUserStudyDto) {
        Map<String, Object> response = new HashMap<>();

        studyService.updateStudyGroupStatus(changeUserStudyDto);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }
}
