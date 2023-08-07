package com.spoon.sok.domain.socket.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 *
 */
@Setter
@Getter
@ToString
public class CodeAPIRequestDto {

    private Long userId;
    private String name;
    private String code;
    private String input;
    
}
