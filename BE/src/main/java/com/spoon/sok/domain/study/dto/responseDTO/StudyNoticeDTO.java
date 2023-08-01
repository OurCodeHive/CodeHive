package com.spoon.sok.domain.study.dto.responseDTO;

import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.entity.StudyNotice;
import com.spoon.sok.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class StudyNoticeDTO {
    private Long authorId;
    private String title;
    private String content;
    private Date uploadAt;

    public StudyNotice toEntity(User author, StudyInfo studyinfo) {
        return StudyNotice.builder()
                .studyInfo(studyinfo)
                .user(author)
                .title(title)
                .content(content)
                .createdAt(uploadAt)
                .build();
    }
}
