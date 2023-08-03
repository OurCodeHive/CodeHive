package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class StudyNoticePreviewDTO {
    private Long studyboardId;
    private Long authorId;
    private String nickName;
    private String noticeTitle;
    private Date uploadAt;
}
