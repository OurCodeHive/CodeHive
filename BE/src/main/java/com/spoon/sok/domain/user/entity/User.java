package com.spoon.sok.domain.user.entity;


import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.user.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Entity
@Table(name = "USERS")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_id")
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
    private Date createdAt; // 가입일

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyedAt; // 최근 수정일

    @Temporal(TemporalType.TIMESTAMP)
    private Date leaveAt; // 탈퇴일

    @OneToMany(mappedBy = "users")
    private List<Report> reportList = new ArrayList<>();

    @OneToMany(mappedBy = "users")
    private List<StudyInfo> studyInfoList = new ArrayList<>();

//    @OneToMany(mappedBy = "users")
//    private List<UserStudy> orders = new ArrayList<>();

}
