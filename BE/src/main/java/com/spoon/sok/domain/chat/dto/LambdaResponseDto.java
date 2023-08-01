package com.spoon.sok.domain.chat.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;

@Data
@ToString
@Setter
@Getter
public class LambdaResponseDto {

    private Long userId;
    private boolean state;
    private ArrayList<String> output;

}
