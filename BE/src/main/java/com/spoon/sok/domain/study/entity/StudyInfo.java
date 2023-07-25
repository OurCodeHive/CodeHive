package com.spoon.sok.domain.study.entity;

//import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "STUDY_INFO")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyinfo_id") // 스터디 정보키
    private Long id;

    @Column(name = "title") //스터디룸 이름
    private String title;

    @Column(name = "studyroom_size") // 스터디 참여인원
    private String studyroomSize;

    @Column(name = "description") // 스터디 설명
    private String description;

    @Column(name = "profileimage") // 스터디 대표(프로필) 이미지
    private String profileImage;

    @Column(name = "enter_name") // 스터디회의(웹IDE접속 스터디룸 이름, 유티크)
    private String enterName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt; // 스터디 그룹 생성일

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 스터디 그룹 종료일

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "users_id", nullable = false)
//    private User users; // 스터디 그룹의 장
}
