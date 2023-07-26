package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.dto.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.StudyCreationDto;
import com.spoon.sok.domain.study.dto.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    @Query(value = "SELECT sa.created_at as createdAt, " +
            "sa.end_at as endAt, " +
            "sa.meeting_at as meetingAt, " +
            "sa.study_appointment_title as title, " +
            "sa.study_appointment_id as studyappointmentId, " +
            "sa.studyinfo_id as studyinfoId " +
            "FROM USERS u " +
            "JOIN STUDY_INFO si ON u.users_id = :userId " +
            "JOIN STUDY_APPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
            "WHERE u.users_id = :userId", nativeQuery = true)
    List<StudyAppointmentDTO> findByUserIdStudyMeetings(@Param("userId") String userId);

    @Query(value = "SELECT sa.created_at as createdAt, " +
            "sa.end_at as endAt, " +
            "sa.meeting_at as meetingAt, " +
            "sa.study_appointment_title as title, " +
            "sa.study_appointment_id as studyappointmentId, " +
            "sa.studyinfo_id as studyinfoId " +
            "FROM USERS u " +
            "JOIN STUDY_INFO si ON u.users_id = :userId " +
            "JOIN STUDY_APPOINTMENT sa ON si.studyinfo_id = sa.studyinfo_id " +
            "WHERE u.users_id = :userId AND sa.meeting_at = :today", nativeQuery = true)
    List<StudyAppointmentDTO> findByTodayStudyMeetings(String today, String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "0 as isEnd " +
            "FROM USER_STUDY us " +
            "JOIN STUDY_INFO si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND si.end_at >= CURRENT_DATE()", nativeQuery = true)
    List<StudyInfoDto> findByUserIdStudyInfoProceeding(String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "1 as isEnd " +
            "FROM USER_STUDY us " +
            "JOIN STUDY_INFO si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND si.end_at < CURRENT_DATE()", nativeQuery = true)
    List<StudyInfoDto> findByUserIdStudyInfoClose(String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title " +
            "FROM USERS U " +
            "JOIN STUDY_INFO si ON u.nickname = ?1 AND si.title LIKE %?2%", nativeQuery = true)
    List<StudyInfoDto> findByNicknameAndTitle(String nickname, String title);

    @Modifying
    @Query(value = "INSERT INTO study_info (users_id, title, description, enter_name, created_at, end_at) " +
            "VALUES (:userId, :title, :description, :enterName, :startAt, :endAt)", nativeQuery = true)
    void saveStudyGroup(@Param("userId") String userId,
                        @Param("title") String title,
                        @Param("description") String description,
                        @Param("enterName") String enterName,
                        @Param("startAt") Date startAt,
                        @Param("endAt") Date endAt);


}
