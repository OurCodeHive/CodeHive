package com.spoon.sok.domain.user.repository;

import com.spoon.sok.domain.study.entity.StudyArchive;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.user.entity.UserStudy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserStudyRepository  extends JpaRepository<UserStudy, Long> {
    @Query(value = "select u " +
            "from UserStudy u " +
            "where u.status = :status AND u.studyInfo.id = :id")
    List<UserStudy> findBelongingUser(@Param("id") Long studyInfoId, @Param("status") CurrentStatus status);

    @Query(value = "select u " +
            "from UserStudy u " +
            "left join fetch u.studyInfo " +
            "where u.studyInfo.users.id = :id and u.users.id != :id")
    List<UserStudy> findByStudyLeader(@Param("id") Long userId);

    Optional<UserStudy> findByStudyInfoIdAndUsersId(Long studyInfoId, Long usersId);

    int deleteByStudyInfoIdAndUsersId(Long studyInfoId, Long usersId);

    // 스터디 그룹의 멤버보기
    Page<UserStudy> findByStudyInfoId(Long studyInfoId, Pageable pageable);

    // 채팅방에 유저목록
    List<UserStudy> findByStudyInfoId(Long studyInfoId);

    @Modifying
    @Query(value = "UPDATE user_study " +
            "SET user_study.status = :status, user_study.users_id = :users_id " +
            "WHERE user_study.userstudy_id = :userstudy_id", nativeQuery = true)
    void saveUserStudyStatusQuery(@Param("users_id") Long usersId,
                                  @Param("userstudy_id") Long userstudyId,
                                  @Param("status") String status);

}
