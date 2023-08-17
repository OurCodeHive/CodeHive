package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StudyErrorResponseDTO {
    private int status;
    private String message;

    @Builder
    public StudyErrorResponseDTO(int status, String message) {
        this.status = status;
        this.message = message;
    }
}

