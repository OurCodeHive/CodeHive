package com.spoon.sok.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ExceptionResponseDto {
    private int status;

    private String message;
}
