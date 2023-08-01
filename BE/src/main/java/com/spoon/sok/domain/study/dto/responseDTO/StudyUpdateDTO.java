package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

//@Getter
//@Setter
//@NoArgsConstructor
//public class StudyUpdateDTO {
//
//    private String title;        // 스터디 그룹의 제목
//    private String description;  // 스터디 그룹의 설명
//    private String startAt;      // 스터디 그룹의 시작 날짜
//    private String endAt;        // 스터디 그룹의 종료 날짜
//}

@Getter
@NoArgsConstructor
public class StudyUpdateDTO {

    private String title;        // 스터디 그룹의 제목
    private String description;  // 스터디 그룹의 설명
    private Date createdAt;      // 스터디 그룹의 시작 날짜
    private Date endAt;        // 스터디 그룹의 종료 날짜

    @Builder
    public StudyUpdateDTO(String title, String description, Date createdAt, Date endAt) {
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.endAt = endAt;
    }


}