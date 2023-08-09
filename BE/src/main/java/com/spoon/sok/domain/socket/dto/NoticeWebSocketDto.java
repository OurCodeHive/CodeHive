package com.spoon.sok.domain.socket.dto;

import lombok.Getter;

@Getter
public class NoticeWebSocketDto {

    private Long userId;
    private Long studyRoomId;
    private String notice;

}
