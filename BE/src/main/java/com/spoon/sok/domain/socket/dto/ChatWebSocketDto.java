package com.spoon.sok.domain.socket.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatWebSocketDto {

    private Long userId;
    private Long studyRoomId;
    private String message;
    private String dateTime;

}