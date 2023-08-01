package com.spoon.sok.domain.chat.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
@ToString
@Setter
@Getter
public class RunCodeRequestDto {

    private Long userId;
    private Long studyRoomId;
    private String code;
    private String input;

}
