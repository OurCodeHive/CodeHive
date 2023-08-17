package com.spoon.sok.domain.study.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Data
@NoArgsConstructor
@Getter
@Setter
public class JoinStudyGroupDto {
    private String email;
    private String nickname;
    private String enterName; // studyinfo_id 랜덤 문자열
}
