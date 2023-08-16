package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.dto.queryDTO.PreCheckUserStudyDto;
import com.spoon.sok.domain.study.dto.queryDTO.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.queryDTO.StudyInfoDetailDto;
import com.spoon.sok.domain.study.dto.queryDTO.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    @Query(value = "SELECT DISTINCT sa.start_time as startTime, " +
            "sa.end_time as endTime, " +
            "sa.meeting_at as meetingAt, " +
            "sa.study_appointment_title as title, " +
            "sa.study_appointment_id as studyappointmentId, " +
            "sa.studyinfo_id as studyinfoId " +
            "FROM user_study u " +
            "JOIN study_info si ON u.users_id = :userId " +
            "JOIN study_appointment sa ON si.studyinfo_id = sa.studyinfo_id " +
            "WHERE u.users_id = :userId", nativeQuery = true)
    List<StudyAppointmentDTO> findByUserIdStudyMeetingsQuery(@Param("userId") String userId);


    @Query(value = "SELECT sa.start_time as startTime, " +
            "sa.end_time as endTime, " +
            "sa.meeting_at as meetingAt, " +
            "sa.study_appointment_title as title, " +
            "sa.study_appointment_id as studyappointmentId, " +
            "sa.studyinfo_id as studyinfoId " +
            "FROM users u " +
            "JOIN study_info si ON u.users_id = :userId " +
            "JOIN study_appointment sa ON si.studyinfo_id = sa.studyinfo_id " +
            "WHERE u.users_id = :userId AND DATE(sa.meeting_at) = DATE(:today) " +
            "ORDER BY sa.start_time ASC", nativeQuery = true)
    List<StudyAppointmentDTO> findByTodayStudyMeetingsQuery(@Param("today") Date today, @Param("userId") String userId);


    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "0 as isEnd " +
            "FROM user_study us " +
            "JOIN study_info si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND us.status = 'ACCEPT' AND si.end_at >= CURRENT_DATE() " +
            "ORDER BY si.start_at ASC ", nativeQuery = true)
    List<StudyInfoDto> findByUserIdStudyInfoProceedingQuery(String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "1 as isEnd " +
            "FROM user_study us " +
            "JOIN study_info si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND us.status = 'ACCEPT' AND si.end_at < CURRENT_DATE() " +
            "ORDER BY si.start_at ASC ", nativeQuery = true)
    List<StudyInfoDto> findByUserIdStudyInfoCloseQuery(String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title " +
            "FROM users U " +
            "JOIN study_info si ON u.users_id = ?1 AND si.title LIKE %?2%", nativeQuery = true)
    List<StudyInfoDto> findByUserIdAndTitleQuery(String userId, String title);

    @Modifying

    @Query(value = "INSERT INTO study_info (users_id, title, description, enter_name, start_at, end_at, profileimage) " +
            "VALUES (:userId, :title, :description, :enterName, :startAt, :endAt, :image)", nativeQuery = true)
    void saveStudyGroup(@Param("userId") String userId,
                        @Param("title") String title,
                        @Param("description") String description,
                        @Param("enterName") String enterName,
                        @Param("startAt") Date startAt,
                        @Param("endAt") Date endAt,
                        @Param("image") String image);

    @Query(value = "SELECT studyinfo_id from study_info where study_info.enter_name = :enterName", nativeQuery = true)
    Long findByEnterNameQuery(@Param("enterName") String enterName);

    @Query(value = "SELECT us.studyinfo_id as studyInfoId, " +
            "us.users_id as usersId, " +
            "us.userstudy_id as userstudyId, " +
            "us.invite_email as inviteEmail, " +
            "us.status as status " +
            "FROM user_study us " +
            "WHERE userstudy_id = :userstudy_id", nativeQuery = true)
    Optional<PreCheckUserStudyDto> findByUserStudyIdQuery(Long userstudy_id);

    @Query(value = "SELECT DATE_FORMAT(si.start_at, '%Y-%m-%d') as startAt, " +
            "DATE_FORMAT(si.end_at, '%Y-%m-%d') as endAt, " +
            "si.studyinfo_id as studyinfoId, " +
            "si.users_id as usersId, " +
            "si.enter_name as enterName, " +
            "si.profileimage as profileImage, " +
            "si.title as title," +
            "si.description as description " +
            "FROM study_info si where studyinfo_id = :studyInfoId", nativeQuery = true)
    Optional<StudyInfoDetailDto> findByStudyInfoIdQuery(String studyInfoId);



}
