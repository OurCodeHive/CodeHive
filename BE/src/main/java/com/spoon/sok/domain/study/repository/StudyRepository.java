package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    List<StudyAppointment> findByNicknameStudyMeetings(String nickname);
}
