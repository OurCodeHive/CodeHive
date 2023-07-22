package com.spoon.sok.domain.study.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Entity
@Table(name = "STUDY_INFO")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyinfo_id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "studyroom_size")
    private String studyroomSize;

    @Column(name = "description")
    private String description;

    @Column(name = "profileimage")
    private String profileImage;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt; // 스터디 그룹 생성일

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 스터디 그룹 종료일

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "users_id", nullable = false)
//    private User users; // 스터디 그룹의 장

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    @JoinColumn(name = "study_appointment_id")
    private List<StudyAppointment> meetingList = new ArrayList<>();
}