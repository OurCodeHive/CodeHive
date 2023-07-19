package com.spoon.sok.domain.user.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@Table(name = "USERS")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "social_login")
    private int socialLogin;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at; // 가입일

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyed_at; // 최근 수정일

    @Temporal(TemporalType.TIMESTAMP)
    private Date leave_at; // 탈퇴일

    private enum UserStatus {
        NORMAL, FORCELEAVE, STOP, CUMULATIVE_REPORT
    }

}
