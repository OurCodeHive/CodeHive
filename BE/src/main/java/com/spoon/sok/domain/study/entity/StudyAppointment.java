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

    @Temporal(TemporalType.TIMESTAMP) // 회의날짜
    private Date date;

    @Temporal(TemporalType.TIMESTAMP) // 회의시작시간
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP) // 회의종료시간
    private Date endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false)
    private StudyInfo studyInfo;
}
