package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeaveStudyRequestDTO {
    private Long studyinfoId;
    private Long userId;       // 자기자신이 스스로 나간다.
}
