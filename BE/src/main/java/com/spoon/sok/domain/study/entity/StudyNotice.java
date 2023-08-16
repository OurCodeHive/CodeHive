package com.spoon.sok.domain.study.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Entity
@Setter
@Table(name = "study_notice")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyboard_id") // 공지사항키
    private Long id;

    @Column(name = "notice_title") // 스터디 공지사항 제목
    private String noticeTitle;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content; // 스터디 설명

    @Temporal(TemporalType.DATE)
    private Date uploadAt; // 스터디 공지사항 등록일자

    // study_info 스터디 정보 테이블과 다대일 관계 - studyinfo_id
    @JsonIgnore // @ManyToOne의 Fetch 타입을 Lazy로 사용했을 때 나타나는 문제점을 해결하기 위한 어노테이션
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false) // 스터디 정보키
    private StudyInfo studyInfo;

    // study_info 스터디 정보 테이블과 다대일 관계 - user_id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User user; // 스터디 그룹장(공지사항 작성자)

    @Builder
    public StudyNotice(Long id, String noticeTitle, String content, Date uploadAt, StudyInfo studyInfo, User user) {
        this.id = id;
        this.noticeTitle = noticeTitle;
        this.content = content;
        this.uploadAt = uploadAt;
        this.studyInfo = studyInfo;
        this.user = user;
    }

    /**
     * 엔티티 수정사항 *
     * createdAt -> uploadAt  *
     * title -> notice_title *
     * title -> noticeTitle *
     */
}