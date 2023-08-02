package com.spoon.sok.domain.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
public class NoticeWebSocketDto {

    private Long userId;
    private Long studyRoomId;
    private String notice;

}
