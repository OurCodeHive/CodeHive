package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyAppointmentRepository extends JpaRepository<StudyAppointment, Long> {
}
