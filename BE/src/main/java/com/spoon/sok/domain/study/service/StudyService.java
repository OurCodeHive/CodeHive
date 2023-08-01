package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.dto.queryDTO.*;
import com.spoon.sok.domain.study.dto.requestDTO.StudyUpdateDTO;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.study.enums.StudyUpdateResult;
import com.spoon.sok.domain.study.repository.StudyRepository;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    public List<StudyAppointmentDTO> getStudyMeeting(String userId) {
        return studyRepository.findByUserIdStudyMeetingsQuery(userId);
    }

    public List<StudyAppointmentDTO> getTodayStudyMeeting(String today, String userId) {
        return studyRepository.findByTodayStudyMeetingsQuery(today, userId);
    }

    public List<StudyInfoDto> getUserStudyGroupProceeding(String userId) {
        return studyRepository.findByUserIdStudyInfoProceedingQuery(userId);
    }

    public List<StudyInfoDto> getUserStudyGroupClose(String userId) {
        return studyRepository.findByUserIdStudyInfoCloseQuery(userId);
    }

    public List<StudyInfoDto> searchUserStudyGroup(String userId, String title) {
        return studyRepository.findByUserIdAndTitleQuery(userId, title);
    }

    @Transactional
    public Long setStudyGroup(StudyCreationDto studyCreationDto) {

        // 웹 IDE 접속하기 위한 10글자 문자열 생성
        studyCreationDto.setEnterName(UUID.randomUUID().toString().substring(0, 10));

        studyRepository.saveStudyGroupQuery(studyCreationDto.getUsersId(),
                studyCreationDto.getTitle(),
                studyCreationDto.getDescription(),
                studyCreationDto.getEnterName(),
                studyCreationDto.getStartAt(),
                studyCreationDto.getEndAt());

        // 최조 스터디 그룹을 만드는 사람은 바로 중간테이블에 저장(스터디 장)
        Long newStudy = studyRepository.findByEnterNameQuery(studyCreationDto.getEnterName());
        studyRepository.saveUserStudyQuery(newStudy,
                studyCreationDto.getUsersId(),
                CurrentStatus.ACCEPT.toString(),
                studyCreationDto.getEmail());

        return newStudy; // studyinfo_id(PK)를 반환
    }

    @Transactional
    public Long setUserStudyForEmail(Long studyinfo_id, String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            studyRepository.saveUserStudyQuery(
                    studyinfo_id, null, CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);

        } else {
            studyRepository.saveUserStudyQuery(
                    studyinfo_id, String.valueOf(user.get().getId()), CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);
        }
    }

    public Optional<PreCheckUserStudyDto> CheckEnterStudyGroupCondition(Long userstudy_id) {
        return studyRepository.findByUserStudyIdQuery(userstudy_id);
    }

    @Transactional
    public void updateStudyGroupStatus(ChangeUserStudyDto changeUserStudyDto) {
        studyRepository.saveUserStudyStatusQuery(changeUserStudyDto.getUsersId(),
                                            changeUserStudyDto.getUserstudyId());
    }


    public Optional<StudyInfoDetailDto> getStudyInfoAll(String studyinfoId) {
        return studyRepository.findByStudyInfoIdQuery(studyinfoId);
    }

    //////////////////////////////////// here
    // Long pk -> Long id 로 수정
    @Transactional
    public StudyUpdateResult updateStudyGroup(Long id, StudyInfo studyUpdateDTO) {
        Optional<StudyInfo> target = studyRepository.findById(id);

        if (target.isPresent()) {
            StudyInfo studyInfo = target.get();
//            studyInfo.updateTitle(studyUpdateDTO.getTitle());
            studyInfo.updateStartAt(studyUpdateDTO.getStartAt());
            studyInfo.updateEndAt(studyUpdateDTO.getEndAt());
            studyRepository.save(studyInfo); // 생략 가능
            return StudyUpdateResult.SUCCESS;
        }

        return StudyUpdateResult.NOT_FOUND;
    }


    /*
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

    public StudyUpdateResult studyUpdateResult(StudyMemberRequestDTO studyMemberRequestDTO) {
    }
     */
}
