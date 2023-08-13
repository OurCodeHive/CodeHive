package com.spoon.sok.domain.socket.dto;

import lombok.Getter;

@Getter
public class CursorWebSocketDto {

    private Long userId;
    private String nickname;
    private String studyRoomId;
    private int x;
    private int y;

}
