package com.spoon.sok.domain.study.entity;

//import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false) // 스터디 정보키
    private StudyInfo studyInfo;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false) // 스터디 그룹장(공지사항 작성자)
//    private User user;
}