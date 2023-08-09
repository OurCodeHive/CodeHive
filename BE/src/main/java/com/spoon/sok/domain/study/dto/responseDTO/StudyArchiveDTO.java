package com.spoon.sok.domain.study.dto.responseDTO;

import com.spoon.sok.domain.study.entity.File;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
public class StudyArchiveDTO {
    private Long id;
    private Date uploadAt;
    private String title;
    private String content;
    private Long userId;
    private String nickname;

    private List<File> fileList;
}
