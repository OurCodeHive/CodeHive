package com.spoon.sok.domain.study.entity;


import com.spoon.sok.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Entity
@Table(name = "study_info")
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

    @Lob
    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "profileimage") // 스터디 대표(프로필) 이미지
    private String profileImage;

    @Column(name = "enter_name") // 스터디회의(웹IDE접속 스터디룸 이름, 유티크)
    private String enterName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt; // 스터디 그룹 생성일

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 스터디 그룹 종료일

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    private List<StudyAppointment> meetingList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User users; // 스터디 그룹의 장

    @Builder
    public StudyInfo(Long id, String title, String studyroomSize, String description, String profileImage, String enterName, Date createdAt, Date endAt, List<StudyAppointment> meetingList, User users) {
        this.id = id;
        this.title = title;
        this.studyroomSize = studyroomSize;
        this.description = description;
        this.profileImage = profileImage;
        this.enterName = enterName;
        this.createdAt = createdAt;
        this.endAt = endAt;
        this.meetingList = meetingList;
        this.users = users;
    }
}