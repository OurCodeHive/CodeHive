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
public class StudyCreationDto {
    private String usersId;
    private String title;
    private String description;
    private String startAt;
    private String endAt;
    private String enterName;
}
