package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.queryDTO.*;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.study.service.StudyService;
import com.spoon.sok.util.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
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
        response.put("studyList", mergedList);

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
            @RequestParam(value = "profile", required = false) List<MultipartFile> multipartFile,
            @RequestParam(value = "userId") String usersId,
            @RequestParam(value = "title") String title,
            @RequestParam(value = "startAt") String startAt,
            @RequestParam(value = "endAt") String endAt,
            @RequestParam(value = "description") String description
    ) throws ParseException, IOException {

        // 문자열 -> Date
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date formatStartAt = format.parse(startAt);
        Date formatEndAt = format.parse(endAt);


        StudyCreationDto studyCreationDto = new StudyCreationDto();
        studyCreationDto.setUsersId(usersId);
        studyCreationDto.setTitle(title);
        studyCreationDto.setDescription(description);
        studyCreationDto.setStartAt(formatStartAt);
        studyCreationDto.setEndAt(formatEndAt);

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("studyinfoId", studyService.setStudyGroup(studyCreationDto, multipartFile));
        response.put("title", title);

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
            if (us.get().getUsersId() == null) {               // 회원가입은 안했다.
                response.put("isOurUser", false);
            } else {
                response.put("isOurUser", true);
            }
        } else {
            response.put("possible_access", false);            // 초대 받은 사람이 아니다.
            response.put("isOurUser", false);                  // 회원가입도 안했다.
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @PostMapping("/study/invite")
    public ResponseEntity<?> setMemberStudyGroup(@RequestBody ChangeUserStudyDto changeUserStudyDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            studyService.updateStudyGroupStatus(changeUserStudyDto);
            response.put("status", 200);
            response.put("message", "스터디에 가입되었습니다.");
        } catch (Exception e) {
            response.put("status", 400);
            response.put("message", "관리자에게 문의해주세요.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @GetMapping("/studyinfo/{studyinfoId}")
    public ResponseEntity<?> getStudyInfo(@PathVariable("studyinfoId") String studyinfo_id) {
        Map<String, Object> response = new HashMap<>();

        Optional<StudyInfoDetailDto> studyInfo = studyService.getStudyInfoAll(studyinfo_id);

        if (studyInfo.isPresent()) {
            response.put("status", 200);
            response.put("startAt", studyInfo.get().getStartAt());
            response.put("endAt", studyInfo.get().getEndAt());
            response.put("studyinfoId", studyInfo.get().getStudyinfoId());
            response.put("users_id", studyInfo.get().getUsersId());
            response.put("enterName", studyInfo.get().getEnterName());
            response.put("profileImage", studyInfo.get().getProfileImage());
            response.put("title", studyInfo.get().getTitle());
            response.put("description", studyInfo.get().getDescription());
        } else {
            response.put("status", 200);
            response.put("message", "존재하지 않은 스터디 그룹입니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }
}