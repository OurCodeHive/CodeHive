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
    private Date createdAt;      // 스터디 그룹의 시작 날짜
    private Date endAt;        // 스터디 그룹의 종료 날짜

    @Builder
    public StudyUpdateDTO(Long id, String title, String description, Date createdAt, Date endAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.endAt = endAt;
    }

    public StudyInfo toEntity() {
        return StudyInfo.builder()
                .id(id)
                .title(title)
                .description(description)
                .createdAt(createdAt)
                .endAt(endAt)
                .build();
    }
}
