package com.spoon.sok.domain.user.entity;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "USERS")
public class User {
    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private Long id;

    @Column(name="email")
    private String email;

    @Column(name="password")
    private String password;

    @Column(name="nickname")
    private String nickname;

    @Column(name="social_login")
    private int socialLogin;

    @Column(name="status")
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at; // 가입일

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyed_at; // 최근 수정일

    @Temporal(TemporalType.TIMESTAMP)
    private Date leave_at; // 탈퇴일

}
