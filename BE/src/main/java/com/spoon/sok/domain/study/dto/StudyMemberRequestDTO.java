package com.spoon.sok.domain.study.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyMemberRequestDTO {
    private String userEmail;
    private Long studyInfoId;
}
