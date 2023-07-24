package com.spoon.sok.domain.study.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class StudyCreationDto {
    private String title;
    private String description;
    private Date startAt;
    private Date endAt;
    private String profileImage;
    private String enterName;
}
