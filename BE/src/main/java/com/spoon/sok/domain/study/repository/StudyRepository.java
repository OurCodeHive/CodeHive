package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    // 현재 branch 차이로 User가 없음.
    // "JOIN STUDY_INFO si ON u.users_id = si.users_id "
    // (@Param("nickname") int nickname); -> nickname이 아닌 usersId
    @Query(value = "SELECT sa.created_at as createdAt, " +
                          "sa.end_at as endAt, " +
                          "sa.meeting_at as meetingAt, " +
                          "sa.study_appointment_title as title, " +
                          "sa.study_appointment_id as studyappointmentId, " +
                          "sa.studyinfo_id as studyinfoId " +
                   "FROM USERS u " +
                   "JOIN STUDY_INFO si ON u.users_id = 1 " +
                   "JOIN STUDY_APPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
                   "WHERE u.users_id = :nickname", nativeQuery = true)
    List<StudyAppointmentDTO> findByNicknameStudyMeetings(@Param("nickname") int nickname);
}
