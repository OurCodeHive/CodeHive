package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeaveStudyRequestDTO {
    private String email;
    private String nickname;
    private Long studyInfoId;
}
