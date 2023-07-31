package com.spoon.sok.domain.study.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "study_appointment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_appointment_id")
    private Long id;

    @Column(name = "study_appointment_title")
    private String title;

    @Temporal(TemporalType.TIMESTAMP)
    private Date meetingAt; // 회의 날짜

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt; // 회의 시작 날짜

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 회의 종료 시간

    // study_info 스터디 정보 테이블과 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false)
    private StudyInfo studyInfo;

    @Builder
    public StudyAppointment(Long id, StudyInfo studyInfo, String title, Date meetingAt, Date createdAt, Date endAt) {
        this.id = id;
        this.studyInfo = studyInfo;
        this.title = title;
        this.meetingAt = meetingAt;
        this.createdAt = createdAt;
        this.endAt = endAt;
    }
}
