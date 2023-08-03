package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DelegateRequestDTO {
    private Long studyinfoId; // 스터디 그룹 ID
    private Long from;        // 기존 방장
    private Long to;          // 바뀔 방장
}