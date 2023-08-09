package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.requestDTO.StudyFileUploadRequestDto;
import com.spoon.sok.domain.study.service.StudyFileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudyFileUploadController {

    private final StudyFileUploadService studyFileUploadService;

    // 스터디 아카이브 만든후 스터디 자료 업로드
    // 스터디 아카이브 &  파일 동시 생성(업로드)
    @PostMapping("/study/file")
    public ResponseEntity<?> stydyFileUploadAPI(
        @RequestParam(value = "studyFile", required = false) List<MultipartFile> multipartFile,
        @RequestParam(value = "userId") Long userId,
        @RequestParam(value = "studyInfoId") Long studyInfoId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content
    ) throws IOException {
        StudyFileUploadRequestDto requestDto = new StudyFileUploadRequestDto();
        requestDto.setSutudyFile(multipartFile);
        requestDto.setUserId(userId);
        requestDto.setStudyInfoId(studyInfoId);
        requestDto.setTitle(title);
        requestDto.setContent(content);
        studyFileUploadService.createStudyArchiveAndstudyFileUpload(requestDto);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}
