package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.dto.*;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.enums.StudyMemberCreationResult;
import com.spoon.sok.domain.study.enums.StudyUpdateResult;
import com.spoon.sok.domain.study.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyService {

    private final StudyRepository studyRepository;

    public List<StudyAppointmentDTO> getStudyMeeting(String userId) {
        return studyRepository.findByUserIdStudyMeetings(userId);
    }

    public List<StudyAppointmentDTO> getTodayStudyMeeting(String today, String userId) {
        return studyRepository.findByTodayStudyMeetings(today, userId);
    }

    public List<StudyInfoDto> getUserStudyGroupProceeding(String userId) {
        return studyRepository.findByUserIdStudyInfoProceeding(userId);
    }

    public List<StudyInfoDto> getUserStudyGroupClose(String userId) {
        return studyRepository.findByUserIdStudyInfoClose(userId);
    }

    public List<StudyInfoDto> searchUserStudyGroup(String userId, String title) {
        return studyRepository.findByUserIdAndTitle(userId, title);
    }

    @Transactional
    public void setStudyGroup(StudyCreationDto studyCreationDto) {

        // 웹 IDE 접속하기 위한 10글자 문자열 생성
        studyCreationDto.setEnterName(UUID.randomUUID().toString().substring(0, 10));

        studyRepository.saveStudyGroup(studyCreationDto.getUsersId(),
                                       studyCreationDto.getTitle(),
                                       studyCreationDto.getDescription(),
                                       studyCreationDto.getEnterName(),
                                       studyCreationDto.getStartAt(),
                                       studyCreationDto.getEndAt());
        return;
    }

    public StudyMemberCreationResult studyMemberCreationResult(StudyMemberRequestDTO requestDto) {
    }

    public StudyUpdateResult updateStudyGroup(Long studyInfoId, StudyUpdateDTO studyUpdateDto) {
    }

    public boolean createStudyNotice(Long studyInfoId, String author, String title, String content, LocalDate uploadAt) {
    }

    public List<StudyNoticeDTO> getStudyNotices(Long studyInfoId, int page, int size) {
    }

    public boolean updateStudyNotice(Long studyInfoId, Long studyBoardId, String author, String title, String content, LocalDate uploadAt) {
    }

    public boolean deleteStudyNotice(Long studyInfoId, Long studyBoardId) {
    }

    public List<StudyDocumentDTO> getStudyDocuments(Long studyInfoId, int page, int size) {
    }

    public List<StudyAppointmentDTO> getStudyMeetingByStudyId(Long studyInfoId) {
    }

    public boolean createStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean updateStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean deleteStudyMeeting(Long studyInfoId, Long studyAppointmentId) {
    }

    public boolean leaveStudy(String email, String nickname, Long studyInfoId) {
    }

    public boolean forceLeaveStudy(String email, String nickname, Long studyInfoId) {
    }

    public List<String> getStudyUsers(Long studyInfoId) {
    }

    public boolean delegateStudyOwnership(String fromNickname, String fromEmail, String toNickname, String toEmail) {
    }

//    @Transactional
//    public void setStudyGroupProfileImage(String originalFileName, String fileSize) {
//
//    }
}
