package com.spoon.sok.domain.study.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeUserStudyDto {
    private Long studyinfoId;
    private Long usersId;
    private Long userstudyId;
    private String inviteEmail;
}
