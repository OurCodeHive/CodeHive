package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.requestDTO.StudyFileUpdateRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.StudyFileUploadRequestDTO;
import com.spoon.sok.domain.study.entity.File;
import com.spoon.sok.domain.study.service.StudyFileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
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
        StudyFileUploadRequestDTO requestDto = new StudyFileUploadRequestDTO();
        requestDto.setSutudyFile(multipartFile);
        requestDto.setUserId(userId);
        requestDto.setStudyInfoId(studyInfoId);
        requestDto.setTitle(title);
        requestDto.setContent(content);
        studyFileUploadService.createStudyArchiveAndstudyFileUpload(requestDto);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    // 스터디 아카이브, 스터디자료 삭제
    @DeleteMapping("/study/file/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        studyFileUploadService.deleteFile(id);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    // 정보수정 삭제
    @PutMapping("/study/file")
    public ResponseEntity<?> updateFile(
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "title") String title,
            @RequestParam(value = "studyInfoId") Long studyInfoId,
            @RequestParam(value = "content") String content,
            @RequestParam(value = "deleteList") List<Long> deleteList,
            @RequestParam(value = "studyFile", required = false) List<MultipartFile> multipartFile
    ) throws IOException {
        StudyFileUpdateRequestDTO requestDto = new StudyFileUpdateRequestDTO();
        requestDto.setStudyArciveId(studyInfoId);
        requestDto.setUserId(userId);
        requestDto.setTitle(title);
        requestDto.setContent(content);
        requestDto.setDeleteList(deleteList);
        if (multipartFile == null) {
            List<MultipartFile> files = new ArrayList<>();
            requestDto.setSutudyFile(files);
        } else {
            requestDto.setSutudyFile(multipartFile);
        }
        List<File> fileList = studyFileUploadService.updateFile(requestDto);
        return new ResponseEntity<List<File>>(fileList, HttpStatus.OK);
    }
}
