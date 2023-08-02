package com.spoon.sok.domain.chat.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class LambdaRequestDto {

    private Long userId;
    private String name;
    private String code;
    private String input;
    
}
