package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.StudyCreationDto;
import com.spoon.sok.domain.study.dto.StudyInfoDto;
import com.spoon.sok.domain.study.service.StudyService;
import com.spoon.sok.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class StudyController {

    @Value("${jwt.secret}")
    private String secretKey;


    private final StudyService studyService;

    @GetMapping("calendar/study")
    public ResponseEntity<?> getCalendarStudyMeeting(@RequestParam("nickname") String nickname) {
        List<StudyAppointmentDTO> studyMeetingList = studyService.getStudyMeeting(nickname);

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

    @GetMapping("today/study")
    public ResponseEntity<Map<String, Object>> getTodayStudyMeeting(@RequestParam("today") String today, HttpServletRequest request) {
        String email = JwtTokenUtil.getEmail(request.getHeader("Authorization"), secretKey);

        List<StudyAppointmentDTO> todayMeetingList = studyService.getTodayStudyMeeting(today, email);

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

    @GetMapping("study")
    public ResponseEntity<Map<String, Object>> getStudyGroup(@RequestParam("nickname") String nickname) {
        List<StudyInfoDto> userStudyGroupProceedingList = studyService.getUserStudyGroupProceeding(nickname);
        List<StudyInfoDto> userStudyGroupCloseList = studyService.getUserStudyGroupClose(nickname);

        List<StudyInfoDto> mergedList = new ArrayList<>();

        Collections.addAll(mergedList, userStudyGroupProceedingList.toArray(new StudyInfoDto[0]));
        Collections.addAll(mergedList, userStudyGroupCloseList.toArray(new StudyInfoDto[0]));

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("study_list", mergedList);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @GetMapping("study/search")
    public ResponseEntity<Map<String, Object>> searchStudyGroup(@RequestParam("nickname") String nickname,
                                                                @RequestParam("title") String title) {
        List<StudyInfoDto> userStudyGroupList = studyService.searchUserStudyGroup(nickname, title);

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("search", userStudyGroupList);

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }

    @PostMapping("study")
    public void makeStudyGroup(@RequestBody StudyCreationDto studyCreationDto, HttpServletRequest request){
//                               @RequestParam("profileImage") MultipartFile file) {
        String email = JwtTokenUtil.getEmail(request.getHeader("Authorization"), secretKey);
        studyService.setStudyGroup(studyCreationDto);
//        studyService.setStudyGroupProfileImage(file.getOriginalFilename(), file.getSize());
    }
}
