package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyService {

    private final StudyRepository studyRepository;

    public List<StudyAppointment> getStudyMeeting(String nickname) {
        return studyRepository.findByNicknameStudyMeetings(nickname);
    }

}
