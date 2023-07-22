package com.spoon.sok.domain.user.entity;


import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.user.dto.UserSignupRequestDto;
import com.spoon.sok.domain.user.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private String email;

    private String password;

    private String nickname;

    @Column(name = "social_login")
    private int socialLogin;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="modified_at")
    private LocalDateTime modifyedAt;

    @Column(name="leave_at")
    private LocalDateTime leaveAt;

    @OneToMany(mappedBy = "users")
    private List<Report> reportList = new ArrayList<>();

    @OneToMany(mappedBy = "users")
    private List<StudyInfo> studyInfoList = new ArrayList<>();

    @Builder
    public User (UserSignupRequestDto requestDto, int socialLogin, UserStatus status, LocalDateTime createdAt) {
        this.email = requestDto.getEmail();
        this.password = requestDto.getPassword();
        this.nickname = requestDto.getNickname();
        this.socialLogin = socialLogin;
        this.status = status;
        this.createdAt = createdAt;
    }
}
