package com.spoon.sok.domain.socket.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SubmitWebSocketDto {

    private Long userId;
    private Long studyRoomId;
    private String language;

}
