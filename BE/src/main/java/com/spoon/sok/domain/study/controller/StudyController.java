package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class StudyController {

    private final StudyService studyService;

    @GetMapping("calendar/study")
    public ResponseEntity<?> getCalendarStudyMeeting(@RequestParam("nickname") String nickname) {
        return studyService.getStudyMeeting(nickname);
    }
}
