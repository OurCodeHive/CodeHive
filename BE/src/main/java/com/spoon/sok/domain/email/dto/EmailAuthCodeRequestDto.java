package com.spoon.sok.domain.email.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EmailAuthCodeRequestDto {
    private String email;

    private String code;

    private LocalDateTime limitTime;
}
