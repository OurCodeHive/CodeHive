package com.spoon.sok.domain.study.enums;

public enum StudyUpdateResult {
    SUCCESS,        // 스터디 그룹 정보가 성공적으로 변경되었음을 나타냄
    NOT_FOUND,      // 스터디 그룹을 찾을 수 없음을 나타냄
    FORBIDDEN       // 접근할 수 없는 회원임을 나타냄
}
