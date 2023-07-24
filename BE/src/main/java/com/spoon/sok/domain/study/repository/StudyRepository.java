package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    @Query(value = "SELECT sa.created_at as createdAt, " +
                          "sa.end_at as endAt, " +
                          "sa.meeting_at as meetingAt, " +
                          "sa.study_appointment_title as title, " +
                          "sa.study_appointment_id as studyappointmentId, " +
                          "sa.studyinfo_id as studyinfoId " +
                   "FROM USERS u " +
                   "JOIN STUDY_INFO si ON u.nickname = :nickname " +
                   "JOIN STUDY_APPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
                   "WHERE u.nickname = :nickname", nativeQuery = true)
    List<StudyAppointmentDTO> findByNicknameStudyMeetings(@Param("nickname") String nickname);

    @Query(value = "SELECT sa.created_at as createdAt, " +
                          "sa.end_at as endAt, " +
                          "sa.meeting_at as meetingAt, " +
                          "sa.study_appointment_title as title, " +
                          "sa.study_appointment_id as studyappointmentId, " +
                          "sa.studyinfo_id as studyinfoId " +
            "FROM USERS u " +
            "JOIN STUDY_INFO si ON u.email = :email " +
            "JOIN STUDY_APPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
            "WHERE u.email = :email AND sa.meeting_at = :today", nativeQuery = true)
    List<StudyAppointmentDTO> findByTodayStudyMeetings(String today, String email);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
                          "si.title as title, " +
                          "0 as isEnd " +
                   "FROM USERS U " +
                   "JOIN STUDY_INFO si ON u.nickname = :nickname " +
                   "WHERE si.end_at >= CURRENT_DATE()", nativeQuery = true)
    List<StudyInfoDto> findByNicknameStudyInfoProceeding(String nickname);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
                          "si.title as title, " +
                          "1 as isEnd " +
            "FROM USERS U " +
            "JOIN STUDY_INFO si ON u.nickname = :nickname " +
            "WHERE si.end_at < CURRENT_DATE()", nativeQuery = true)
    List<StudyInfoDto> findByNicknameStudyInfoClose(String nickname);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title " +
            "FROM USERS U " +
            "JOIN STUDY_INFO si ON u.nickname = ?1 AND si.title LIKE %?2%", nativeQuery = true)
    List<StudyInfoDto> findByNicknameAndTitle(String nickname, String title);
}
