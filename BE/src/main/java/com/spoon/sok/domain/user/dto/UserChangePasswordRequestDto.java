package com.spoon.sok.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserChangePasswordRequestDto {
    private String email;

    private String newPassword;

    private String authCode;
}
