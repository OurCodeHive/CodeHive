package com.spoon.sok.domain.user.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserLogoutRequestDto {
    private String accessToken;

    private String refreshToken;
}
