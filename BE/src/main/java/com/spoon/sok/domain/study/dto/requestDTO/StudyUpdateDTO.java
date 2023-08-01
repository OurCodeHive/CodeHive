package com.spoon.sok.domain.study.dto.requestDTO;

import com.spoon.sok.domain.study.entity.StudyInfo;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.SQLOutput;
import java.util.Date;

@Getter
@NoArgsConstructor
public class StudyUpdateDTO {
    private Long id;
//    private User users;
    private Long usersId;
    private String title;        // 스터디 그룹의 제목
    private String description;  // 스터디 그룹의 설명
    private Date startAt;      // 스터디 그룹의 시작 날짜
    private Date endAt;        // 스터디 그룹의 종료 날짜

    @Builder
    public StudyUpdateDTO(Long id, String title, String description, Date startAt, Date endAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startAt = startAt;
        this.endAt = endAt;
    }

    public StudyInfo toEntity() {
        return StudyInfo.builder()
                .id(id)
                .title(title)
                .description(description)
                .startAt(startAt)
                .endAt(endAt)
                .build();
    }
}
