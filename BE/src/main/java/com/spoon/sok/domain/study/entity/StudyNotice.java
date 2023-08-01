package com.spoon.sok.domain.study.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter @Setter
@Entity
@Table(name = "study_notice")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyboard_id") // 공지사항키
    private Long id;

    @Column(name = "title") // 스터디 제목
    private String title;

    @Column(name = "content") // 스터디 내용
    private String content;

    @Temporal(TemporalType.DATE)
    private Date createdAt; // 스터디 공지사항 등록일자

    // study_info 스터디 정보 테이블과 다대일 관계 - studyinfo_id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false) // 스터디 정보키
    private StudyInfo studyInfo;

    // study_info 스터디 정보 테이블과 다대일 관계 - user_id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User user; // 스터디 그룹장(공지사항 작성자)

    @Builder
    public StudyNotice(Long id, String title, String content, Date createdAt, StudyInfo studyInfo, User user) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.studyInfo = studyInfo;
        this.user = user;
    }
}