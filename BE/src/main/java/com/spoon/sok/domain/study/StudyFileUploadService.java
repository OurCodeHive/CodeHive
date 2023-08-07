package com.spoon.sok.domain.study;

import com.spoon.sok.aws.S3Service;
import com.spoon.sok.domain.study.entity.File;
import com.spoon.sok.domain.study.entity.StudyArchive;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.repository.StudyArchiveRepository;
import com.spoon.sok.domain.study.repository.StudyFileRepository;
import com.spoon.sok.domain.study.repository.StudyRepository;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudyFileUploadService {

    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final StudyArchiveRepository studyArchiveRepository;
    private final StudyFileRepository studyFileRepository;

    public void createStudyArchiveAndstudyFileUpload(StudyFileUploadRequestDto requestDto) throws IOException {

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
                .content(requestDto.getTitle())
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
}
