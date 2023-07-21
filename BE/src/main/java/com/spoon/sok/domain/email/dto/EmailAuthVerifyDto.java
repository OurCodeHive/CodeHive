package com.spoon.sok.domain.email.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailAuthVerifyDto {
    private String email;

    private String authCode;
}
