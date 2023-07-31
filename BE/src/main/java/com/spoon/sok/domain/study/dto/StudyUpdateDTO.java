package com.spoon.sok.domain.study.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StudyUpdateDTO {

    private String title;        // 스터디 그룹의 제목
    private String description;  // 스터디 그룹의 설명
    private String startAt;      // 스터디 그룹의 시작 날짜
    private String endAt;        // 스터디 그룹의 종료 날짜
}