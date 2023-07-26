package com.spoon.sok.domain.email.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Table(name = "EMAIL_AUTH")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_auth_id")
    private Long id;

    private String email;

    private String authCode;

    @Column(name = "limit_time")
    private LocalDateTime limitTime;

    @Builder.Default
    private int isauth = 0;

    @Builder
    public Email(String email, String authCode, LocalDateTime limitTime, int isauth) {
        this.email = email;
        this.authCode = authCode;
        this.limitTime = limitTime;
        this.isauth = isauth;
    }

    public void updateIsAuth(int isauth) {
        this.isauth = isauth;
    }
}
