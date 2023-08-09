package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@ToString
public class StudyFileUploadRequestDto {

    private Long studyInfoId;
    private Long userId;
    private String title;
    private String content;
    private List<MultipartFile> sutudyFile;

}
