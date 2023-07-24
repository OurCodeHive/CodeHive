package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<StudyInfoDto> getUserStudyGroup(String nickname) {
        return studyRepository.findByNicknameStudyInfos(nickname);
    }

    public List<StudyInfoDto> searchUserStudyGroup(String nickname, String title) {
        return studyRepository.findByNicknameAndTitle(nickname, title);
    }
}
