package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.StudyCreationDto;
import com.spoon.sok.domain.study.dto.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyService {

    private final StudyRepository studyRepository;

    public List<StudyAppointmentDTO> getStudyMeeting(String nickname) {
        return studyRepository.findByNicknameStudyMeetings(nickname);
    }

    public List<StudyAppointmentDTO> getTodayStudyMeeting(String today, String email) {
        return studyRepository.findByTodayStudyMeetings(today, email);
    }

    public List<StudyInfoDto> getUserStudyGroupProceeding(String nickname) {
        return studyRepository.findByNicknameStudyInfoProceeding(nickname);
    }

    public List<StudyInfoDto> getUserStudyGroupClose(String nickname) {
        return studyRepository.findByNicknameStudyInfoClose(nickname);
    }

    public List<StudyInfoDto> searchUserStudyGroup(String nickname, String title) {
        return studyRepository.findByNicknameAndTitle(nickname, title);
    }

    public void setStudyGroup(StudyCreationDto studyCreationDto) {

        // 웹 IDE 접속하기 위한 10글자 문자열 생성
        studyCreationDto.setEnterName(UUID.randomUUID().toString().substring(0, 9));

        // 스터디 그룹의 대표이미지 1장을 s3로 업로드

        studyRepository.saveStudyGroup(studyCreationDto);
        return;
    }
}
