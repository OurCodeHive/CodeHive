package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ForceLeaveRequestDTO {
    private Long studyinfoId; // 스터디 그룹 ID
    private Long from;        // 현재 방장 users_id
    private Long target;      // 강퇴할 대상 users_id
}
