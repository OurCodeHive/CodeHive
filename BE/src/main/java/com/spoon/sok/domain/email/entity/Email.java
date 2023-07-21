package com.spoon.sok.domain.email.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "EMAIL_AUTH")
@NoArgsConstructor
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_auth_id")
    private String id;

    private String email;

    private String code;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "limit_time")
    private Date limitTime;
}
