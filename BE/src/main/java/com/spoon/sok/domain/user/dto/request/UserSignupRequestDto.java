package com.spoon.sok.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserSignupRequestDto {
    private String email;

    private String password;

    private String nickname;

    private String authCode;
}

