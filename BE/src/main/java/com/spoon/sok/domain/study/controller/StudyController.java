package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.queryDTO.*;
import com.spoon.sok.domain.study.dto.requestDTO.UpdateStudyInfoRequestDto;
import com.spoon.sok.domain.study.dto.responseDTO.StudyAppointmentResponseDTO;
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
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudyController {

    private final StudyService studyService;
    private final JwtTokenProvider jwtTokenProvider;

    // 스터디 생성
    // http://localhost:8080/api/study
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

    // 스터디 초대 수락/거절
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

    // 스터디 가입관련 올바른 접근 확인
    @GetMapping("/study/invite/pre-check")
    public ResponseEntity<Map<String, Object>> getEnterStudyGroupConditionCheck(
            @RequestParam("userstudyId") Long userstudy_id) {

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
            if (us.get().getUsersId() == null) {
                response.put("isOurUser", false);
            } else {
                response.put("isOurUser", true);
            }
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    // 사용자가 가입한 스터디 전부 조회
    // http://localhost:8080/api/study?user=<사용자ID>
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

    // 사용자의 스터디 중 제목으로 조회
    // http://localhost:8080/api/study/search?user=<사용자ID>&title=<검색할_스터디_제목>
    @GetMapping("/study/search")
    public ResponseEntity<Map<String, Object>> searchStudyGroup(@RequestParam("user") String userId,
                                                                @RequestParam("title") String title) {
        List<StudyInfoDto> userStudyGroupList = studyService.searchUserStudyGroup(userId, title);

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("search", userStudyGroupList);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    // 스터디 상세정보 조회
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
            response.put("enterName", studyInfo.get().getStudyinfoId());
            response.put("profileImage", studyInfo.get().getProfileImage());
            response.put("title", studyInfo.get().getTitle());
            response.put("description", studyInfo.get().getDescription());
        } else {
            response.put("status", 400);
            response.put("message", "존재하지 않은 스터디 그룹입니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    // 사용자의 모든 일정 조회
    // http://localhost:8080/api/calendar/study?user=<사용자ID>
    @GetMapping("/calendar/study")
    public ResponseEntity<?> getCalendarStudyMeeting(@RequestParam("user") String userId) {
        List<StudyAppointmentResponseDTO> studyMeetingList = studyService.getFormattedStudyMeeting(userId);
        Map<String, Object> response = new HashMap<>();

        if (!studyMeetingList.isEmpty()) {
            response.put("status", 200);
            response.put("calendar", studyMeetingList);
        } else {
            response.put("status", 200);
            response.put("calendar", studyMeetingList);
            response.put("message", "예정된 study가 없습니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }


    // 사용자의 모든 일정 중 특정 날짜로 조회
    // http://localhost:8080/api/today/study?today=yyyy-MM-dd
    @GetMapping("/today/study")
    public ResponseEntity<Map<String, Object>> getTodayStudyMeeting(@RequestParam("today") String today, HttpServletRequest request) {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date todayDate;
        try {
            todayDate = dateFormat.parse(today);
        } catch (ParseException e) {
            todayDate = null;
        }

        Claims token = jwtTokenProvider.parseClaims(request.getHeader("Authorization").substring(7));
        List<StudyAppointmentResponseDTO> todayMeetingList = studyService.getFormattedTodayStudyMeeting(todayDate, (String) token.get("users_id"));

        Map<String, Object> response = new HashMap<>();

        if (!todayMeetingList.isEmpty()) {
            response.put("status", 200);
            response.put("today", todayMeetingList);
        } else {
            response.put("status", 200);
            response.put("today", todayMeetingList);
            response.put("message", "오늘 예정된 스터디가 없습니다.");
        }

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    // 스터디 수정
    @PutMapping("/study")
    public ResponseEntity<?> updateStudyGroup(
            @RequestParam(value = "profile", required = false) List<MultipartFile> multipartFile,
//            @RequestParam(value = "userId") String usersId,
            @RequestParam(value = "studyInfoId") Long studyInfoId,
            @RequestParam(value = "title") String title,
            @RequestParam(value = "startAt") String startAt,
            @RequestParam(value = "endAt") String endAt,
            @RequestParam(value = "description") String description
    ) throws ParseException, IOException {

        // 문자열 -> Date
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date formatStartAt = format.parse(startAt);
        Date formatEndAt = format.parse(endAt);

        UpdateStudyInfoRequestDto updateStudyInfoDto = new UpdateStudyInfoRequestDto();
        updateStudyInfoDto.setStudyInfoId(studyInfoId);
        updateStudyInfoDto.setTitle(title);
        updateStudyInfoDto.setDescription(description);

        updateStudyInfoDto.setStartAt(formatStartAt);
        updateStudyInfoDto.setEndAt(formatEndAt);

        studyService.updateStudyInfo(updateStudyInfoDto, multipartFile);



        return new ResponseEntity<Void>(HttpStatus.OK);
    }

}