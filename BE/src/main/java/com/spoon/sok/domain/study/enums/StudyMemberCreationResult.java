package com.spoon.sok.domain.study.enums;

public enum StudyMemberCreationResult {
    SUCCESS,               // 스터디 멤버 생성 성공
    FORBIDDEN,             // 스터디 멤버 생성 권한이 없음
    INTERNAL_SERVER_ERROR  // 스터디 멤버 생성 중 내부 서버 오류 발생
}
