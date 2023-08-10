package com.spoon.sok.domain.user.repository;

import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.user.entity.UserStudy;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
