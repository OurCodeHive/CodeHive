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
        studyCreationDto.setEnterName(UUID.randomUUID().toString().substring(0, 9));

        studyRepository.saveStudyGroup("1",
                                       studyCreationDto.getTitle(),
                                       studyCreationDto.getDescription(),
                                       studyCreationDto.getEnterName(),
                                       studyCreationDto.getStartAt(),
                                       studyCreationDto.getEndAt());
        return;
    }

    @Transactional
    public void setStudyGroupProfileImage(String originalFileName, String fileSize) {

    }
}
