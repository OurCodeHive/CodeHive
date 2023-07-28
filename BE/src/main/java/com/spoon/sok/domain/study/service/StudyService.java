package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.dto.*;
import com.spoon.sok.domain.study.enums.CurrentStatus;
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
    public Long setStudyGroup(StudyCreationDto studyCreationDto) {

        // 웹 IDE 접속하기 위한 10글자 문자열 생성
        studyCreationDto.setEnterName(UUID.randomUUID().toString().substring(0, 10));

        studyRepository.saveStudyGroup(studyCreationDto.getUsersId(),
                studyCreationDto.getTitle(),
                studyCreationDto.getDescription(),
                studyCreationDto.getEnterName(),
                studyCreationDto.getStartAt(),
                studyCreationDto.getEndAt());

        // 최조 스터디 그룹을 만드는 사람은 바로 중간테이블에 저장(스터디 장)
        Long newStudy = studyRepository.findByEnterName(studyCreationDto.getEnterName());
        studyRepository.saveUserStudy(newStudy,
                studyCreationDto.getUsersId(),
                CurrentStatus.ACCEPT.toString(),
                studyCreationDto.getEmail());

        return newStudy; // studyinfo_id(PK)를 반환
    }

    @Transactional
    public Long setUserStudyForEmail(Long studyinfo_id, String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            studyRepository.saveUserStudy(
                    studyinfo_id, null, CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmail(studyinfo_id, CurrentStatus.WAIT.toString(), email);

        } else {
            studyRepository.saveUserStudy(
                    studyinfo_id, String.valueOf(user.get().getId()), CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmail(studyinfo_id, CurrentStatus.WAIT.toString(), email);
        }
    }

    public Optional<PreCheckUserStudyDto> CheckEnterStudyGroupCondition(Long userstudy_id) {
        return studyRepository.findByUserStudyId(userstudy_id);
    }

    @Transactional
    public void updateStudyGroupStatus(ChangeUserStudyDto changeUserStudyDto) {
        studyRepository.saveUserStudyStatus(changeUserStudyDto.getUsersId(),
                                            changeUserStudyDto.getUserstudyId());
    }

    public Optional<StudyInfoDetailDto> getStudyInfoAll(String studyinfoId) {
        return studyRepository.findByStudyInfoId(studyinfoId);
    }
}
