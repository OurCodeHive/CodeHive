package com.spoon.sok.domain.study.dto;

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

    // 생성자, getter, setter 등 추가적인 메서드들 (필요 시 구현)
}
