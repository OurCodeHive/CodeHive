package com.spoon.sok.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserResponseDto {
    @Builder
    @Getter
    @AllArgsConstructor
    public static class TokenInfo {
        private String grantType;
        private String accessToken;
        private String refreshToken;
        private Long refreshTokenExpirationTime;
    }

    private TokenInfo tokenInfo;

    private Long userId;

    private int responseCode;

    @Builder
    public UserResponseDto(TokenInfo tokenInfo, Long userId, int responseCode) {
        this.tokenInfo = tokenInfo;
        this.userId = userId;
        this.responseCode = responseCode;
    }

    @Builder
    public UserResponseDto(int responseCode) {
        this.responseCode = responseCode;
    }
}