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
    private Long studyboardId; // id를 studyboardId로 변경
    private Long authorId;
    private String noticeTitle;
    private String content;
    private Date uploadAt;

    @Builder
    public StudyNoticeDTO(Long id, Long authorId, String noticeTitle, String content, Date uploadAt) {
        this.studyboardId = id; // id를 studyboardId로 설정
        this.authorId = authorId;
        this.noticeTitle = noticeTitle;
        this.content = content;
        this.uploadAt = uploadAt;
    }

    // 추가 생성자: studyboardId를 제외한 필드들을 인자로 받는 생성자
    public StudyNoticeDTO(Long authorId, String noticeTitle, String content, Date uploadAt) {
        this.authorId = authorId;
        this.noticeTitle = noticeTitle;
        this.content = content;
        this.uploadAt = uploadAt;
    }

    public StudyNotice toEntity(User author, StudyInfo studyinfo) {
        return StudyNotice.builder()
                .studyInfo(studyinfo)
                .user(author)
                .noticeTitle(noticeTitle)
                .content(content)
                .uploadAt(uploadAt)
                .build();
    }

    /**
     * 변경사항 *
     * createdAt -> uploadAt *
     * title -> noticeTitle *
     */
}
