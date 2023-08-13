package com.spoon.sok.domain.socket.dto;

import lombok.Getter;

@Getter
public class NoticeWebSocketDto {

    private Long userId;
    private String nickname;
    private Long studyRoomId;
    private String notice;

}
