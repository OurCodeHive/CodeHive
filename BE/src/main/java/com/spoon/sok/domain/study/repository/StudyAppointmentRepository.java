package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyAppointmentRepository extends JpaRepository<StudyAppointment, Long> {
    List<StudyAppointment> findByStudyInfoId(Long studyInfoId);
}
