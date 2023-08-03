package com.java.compile;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ResponseDto {

    boolean state;
    List<String> output;
    String userId;

}
