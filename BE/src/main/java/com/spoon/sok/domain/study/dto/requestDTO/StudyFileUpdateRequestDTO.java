package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@ToString
public class StudyFileUpdateRequestDTO {

    private Long userId;
    private Long studyArciveId;
    private String title;
    private String content;
    private List<Long> deleteList;
    private List<MultipartFile> sutudyFile;

}
