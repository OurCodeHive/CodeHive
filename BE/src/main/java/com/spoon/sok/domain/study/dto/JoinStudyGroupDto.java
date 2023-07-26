package com.spoon.sok.domain.study.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class JoinStudyGroupDto {
    private String email;
    private String nickname;
    private String enterName; // studyinfo_id 랜덤 문자열
}
