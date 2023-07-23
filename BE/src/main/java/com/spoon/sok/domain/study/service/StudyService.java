package com.spoon.sok.domain.study.service;

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

    public List<StudyAppointment> getStudyMeeting(String nickname) {
        log.info("StudyService입니다. {} ", nickname);
//        int userId = userRepository.findById(nickname);
        return studyRepository.findByNicknameStudyMeetings(1);
    }

}
