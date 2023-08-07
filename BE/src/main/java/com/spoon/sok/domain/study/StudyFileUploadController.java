package com.spoon.sok.domain.study;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudyFileUploadController {

    StudyFileUploadService studyFileUploadService;

    // 스터디 자료 업로드
    @PostMapping("/study/file")
    public void stydyFileUploadAPI(
        @RequestParam(value = "sutudyFile", required = false) List<MultipartFile> multipartFile,
        @RequestParam(value = "userId") Long userId,
        @RequestParam(value = "studyInfoId") Long studyInfoId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content
    ) {
        StudyFileUploadRequestDto requestDto = new StudyFileUploadRequestDto();
        requestDto.setSutudyFile(multipartFile);
        requestDto.setUserId(userId);
        requestDto.setStudyInfoId(studyInfoId);
        requestDto.setTitle(title);
        requestDto.setContent(content);

        studyFileUploadService.studyFileUpload(requestDto);
    }
}
