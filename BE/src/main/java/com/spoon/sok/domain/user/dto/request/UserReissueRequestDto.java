package com.spoon.sok.domain.user.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserReissueRequestDto {
    @NotEmpty(message = "accessToken을 입력해주세요")
    private String accessToken;

    @NotEmpty(message = "refreshToken을 입력해주세요")
    private String refreshToken;
}
