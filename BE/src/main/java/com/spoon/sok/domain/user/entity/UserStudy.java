package com.spoon.sok.domain.user.entity;

import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "user_study")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userstudy_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyinfo_id", nullable = false)
    private StudyInfo studyInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User users;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CurrentStatus status;
}