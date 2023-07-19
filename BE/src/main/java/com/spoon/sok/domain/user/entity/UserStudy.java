package com.spoon.sok.domain.user.entity;

import com.spoon.sok.domain.study.enums.CurrentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "USER_STUDY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyinfo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User users;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CurrentStatus status;
}
