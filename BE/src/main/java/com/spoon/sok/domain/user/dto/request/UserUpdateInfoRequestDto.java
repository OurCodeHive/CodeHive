package com.spoon.sok.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateInfoRequestDto {
    private Long userId;

    private String nickname;

    private String email;

    private String password;
}
