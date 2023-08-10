package com.spoon.sok.domain.study.service;

import com.spoon.sok.aws.S3Service;
import com.spoon.sok.domain.study.dto.requestDTO.StudyFileUpdateRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.StudyFileUploadRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.FileInfoDto;
import com.spoon.sok.domain.study.entity.File;
import com.spoon.sok.domain.study.entity.StudyArchive;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.repository.StudyArchiveRepository;
import com.spoon.sok.domain.study.repository.StudyFileRepository;
import com.spoon.sok.domain.study.repository.StudyRepository;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyFileUploadService {

    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final StudyArchiveRepository studyArchiveRepository;
    private final StudyFileRepository studyFileRepository;

    public void createStudyArchiveAndstudyFileUpload(StudyFileUploadRequestDTO requestDto) throws IOException {

        Long userId = requestDto.getUserId();
        Long studyInfoId = requestDto.getStudyInfoId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 user가 존재하지 않습니다."));
        StudyInfo studyInfo = studyRepository.findById(studyInfoId)
                .orElseThrow(() -> new IllegalArgumentException("해당 study가 존재하지 않습니다."));

        Date uploadAt = new Date();

        StudyArchive studyArchive = StudyArchive.builder()
                .uploadAt(uploadAt)
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .studyInfo(studyInfo)
                .user(user)
                .build();

        StudyArchive saveStudyArchive = studyArchiveRepository.save(studyArchive);

        List<FileInfoDto> studyFileList = new ArrayList<>();
        for (MultipartFile file : requestDto.getSutudyFile()) {
            studyFileList.add(s3Service.uploadWithDownLoad(file));
        }
        for (FileInfoDto info : studyFileList) {
            System.out.println(info);
            File file = File.builder()
                    .fileSize(info.getSize())
                    .originName(info.getOriginName())
                    .realName(info.getUniqueName())
                    .path(info.getUrl())
                    .etc(info.getExtension())
                    .studyArchive(saveStudyArchive)
                    .build();
            studyFileRepository.save(file);
        }
    }

    public void deleteFile(Long studyArchiveId) {
        StudyArchive studyArchive = studyArchiveRepository.findById(studyArchiveId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id = " + studyArchiveId));
        studyArchiveRepository.delete(studyArchive);
    }

    public List<File> updateFile(StudyFileUpdateRequestDTO requestDto) throws IOException {
        // 아카이브 수정
        Long targetUpdateArchiveId = requestDto.getStudyArciveId();
        StudyArchive targetStudyArchive = studyArchiveRepository.findById(targetUpdateArchiveId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id = " + targetUpdateArchiveId));
        targetStudyArchive.updateStudyArchiveInfo(requestDto.getTitle(), requestDto.getContent());

        // 자료삭제
        List<Long> deleteList = requestDto.getDeleteList();
        for (Long index: deleteList) {
            File file = studyFileRepository.findById(index)
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id = " + index));
            studyFileRepository.delete(file);
        }

        // 추가 자료등록
        List<FileInfoDto> studyFileList = new ArrayList<>();
        for (MultipartFile file : requestDto.getSutudyFile()) {
            studyFileList.add(s3Service.uploadWithDownLoad(file));
        }
        for (FileInfoDto info : studyFileList) {
            System.out.println(info);
            File file = File.builder()
                    .fileSize(info.getSize())
                    .originName(info.getOriginName())
                    .realName(info.getUniqueName())
                    .path(info.getUrl())
                    .etc(info.getExtension())
                    .studyArchive(targetStudyArchive)
                    .build();
            studyFileRepository.save(file);
        }

        // 수정한 파일 정보 받기
        return studyFileRepository.findByStudyArchive(targetStudyArchive);
    }
}
