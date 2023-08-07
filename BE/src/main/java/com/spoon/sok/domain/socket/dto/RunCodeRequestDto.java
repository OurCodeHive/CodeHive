package com.spoon.sok.domain.socket.dto;

import lombok.Getter;

/**
 * 프론트에서 오는 정보 받는 DTO
 */
@Getter
public class RunCodeRequestDto {

    private String language;
    private Long userId;
    private Long studyRoomId;
    private String code;
    private String input;

}
