package com.spoon.sok.domain.socket.dto;

import lombok.Getter;

@Getter
public class CursorWebSocketDto {

    private Long userId;
    private Long studyRoomId;
    private int x;
    private int y;

}
