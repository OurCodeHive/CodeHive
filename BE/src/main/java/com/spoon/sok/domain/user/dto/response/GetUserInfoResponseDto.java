package com.spoon.sok.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetUserInfoResponseDto {
    private String email;

    private String nickname;
}
