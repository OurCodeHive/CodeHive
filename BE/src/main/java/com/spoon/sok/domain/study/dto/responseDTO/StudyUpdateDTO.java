package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@NoArgsConstructor
public class StudyUpdateDTO {

    private String title;        // 스터디 그룹의 제목
    private String description;  // 스터디 그룹의 설명
    private Date startAt;      // 스터디 그룹의 시작 날짜
    private Date endAt;        // 스터디 그룹의 종료 날짜

    @Builder
    public StudyUpdateDTO(String title, String description, Date startAt, Date endAt) {
        this.title = title;
        this.description = description;
        this.startAt = startAt;
        this.endAt = endAt;
    }


}