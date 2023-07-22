package com.spoon.sok.domain.study.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "STUDY_APPOINTMENT")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_appointment_id")
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date meetingAt; // 회의 날짜

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt; // 회의 시작 날짜

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 회의 종료 시간

    @ManyToOne
    @JoinColumn(name = "studyinfo_id")
    private StudyInfo studyInfo;
}
