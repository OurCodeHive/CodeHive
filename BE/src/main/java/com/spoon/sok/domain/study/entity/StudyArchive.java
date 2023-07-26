package com.spoon.sok.domain.study.entity;

//import com.spoon.sok.domain.user.entity.User;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Table(name = "study_archive")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyArchive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyarchive_id") // 스터디 자료키
    private Long id;

    @Temporal(TemporalType.DATE) // 스터디 자료 등록일자
    private Date uploadAt;

    @Column(name = "title") // 스터디 제목
    private String title;

    @Column(name = "content") // 스터디 내용
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false) // 스터디 정보키
    private StudyInfo studyInfo;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false) // 유저키
//    private User user;
}
