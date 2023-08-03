package com.spoon.sok.domain.chat.dto;

import lombok.Getter;

@Getter
public class RunCodeRequestDto {

    private String language;
    private Long userId;
    private Long studyRoomId;
    private String code;
    private String input;

}
