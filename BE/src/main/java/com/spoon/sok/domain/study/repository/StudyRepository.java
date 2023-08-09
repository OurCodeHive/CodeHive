package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.dto.queryDTO.PreCheckUserStudyDto;
import com.spoon.sok.domain.study.dto.queryDTO.StudyAppointmentDTO;
import com.spoon.sok.domain.study.dto.queryDTO.StudyInfoDetailDto;
import com.spoon.sok.domain.study.dto.queryDTO.StudyInfoDto;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface StudyRepository extends JpaRepository<StudyInfo, Long> {

    @Query(value = "SELECT sa.start_time as startTime, " +
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
            "WHERE u.users_id = :userId AND DATE(sa.meeting_at) = DATE(:today)", nativeQuery = true)
    List<StudyAppointmentDTO> findByTodayStudyMeetingsQuery(@Param("today") Date today, @Param("userId") String userId);


    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "0 as isEnd " +
            "FROM user_study us " +
            "JOIN study_info si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND si.end_at >= CURRENT_DATE()", nativeQuery = true)
    List<StudyInfoDto> findByUserIdStudyInfoProceedingQuery(String userId);

    @Query(value = "SELECT si.studyinfo_id as studyinfoId, " +
            "si.title as title, " +
            "1 as isEnd " +
            "FROM user_study us " +
            "JOIN study_info si ON us.studyinfo_id = si.studyinfo_id " +
            "WHERE us.users_id = :userId AND si.end_at < CURRENT_DATE()", nativeQuery = true)
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

    @Modifying
    @Query(value = "INSERT INTO user_study (studyinfo_id, users_id, status, invite_email) " +
            "VALUES (:studyinfo_id, :userId, :status, :email)", nativeQuery = true)
    void saveUserStudyQuery(@Param("studyinfo_id") Long newStudy,
                       @Param("userId") String userid,
                       @Param("status") String status,
                       @Param("email") String email);

    @Query(value = "SELECT userstudy_id " +
            "FROM user_study " +
            "WHERE studyinfo_id = :studyinfo_id AND status = :status AND invite_email = :email", nativeQuery = true)
    Long findByStudyInfoAndStatusAndEmailQuery(@Param("studyinfo_id") Long newStudy,
                                  @Param("status") String status,
                                  @Param("email") String email);

    @Query(value = "SELECT us.studyinfo_id, " +
            "us.users_id, " +
            "us.userstudy_id, " +
            "us.invite_email, " +
            "us.status " +
            "FROM user_study us " +
            "WHERE userstudy_id = :userstudy_id", nativeQuery = true)
    Optional<PreCheckUserStudyDto> findByUserStudyIdQuery(Long userstudy_id);


    @Modifying
    @Query(value = "UPDATE user_study " +
            "SET user_study.status = 'ACCEPT', user_study.users_id = :users_id " +
            "WHERE user_study.userstudy_id = :userstudy_id", nativeQuery = true)
    void saveUserStudyStatusQuery(@Param("users_id") Long usersId,
                             @Param("userstudy_id") Long userstudyId);

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
