package com.spoon.sok.domain.study.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Entity
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

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT") // 스터디 내용
    private String content;

    // study_info 스터디 정보 테이블과 다대일 관계
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false) // 스터디 정보키
    private StudyInfo studyInfo;

    // users 유저 테이블과 다대일 관계
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false) // 스터디 정보키
    private User users;

    //file 파일 테이블과 일대다 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyArchive")
    private List<File> fileList;

    @Builder
    public StudyArchive(Date uploadAt, String title, String content, StudyInfo studyInfo, User user) {
        this.uploadAt = uploadAt;
        this.title = title;
        this.content = content;
        this.studyInfo = studyInfo;
        this.users = user;
    }
}
