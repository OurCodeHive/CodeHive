package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    @Query(value = "SELECT sa.* " +
                   "FROM USER u " +
                   "JOIN STUDYINFO si ON u.user_id = si.user_id " +
                   "JOIN STUDYAPPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
                   "WHERE u.user_id = :=nickname", nativeQuery = true)
    List<StudyAppointment> findByNicknameStudyMeetings(@Param("nickname") int nickname);
}
