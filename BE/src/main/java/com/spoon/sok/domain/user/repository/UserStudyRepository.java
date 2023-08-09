package com.spoon.sok.domain.user.repository;

import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.user.entity.UserStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserStudyRepository  extends JpaRepository<UserStudy, Long> {
    @Query(value = "select userstudy " +
            "from UserStudy userstudy " +
            "where userstudy.status = :status AND userstudy.studyInfo.id = :id")
    List<UserStudy> findBelongingUser(@Param("id") Long studyinfoId, @Param("status") CurrentStatus status);

    Optional<UserStudy> findByStudyInfoIdAndUsersId(Long studyinfoId, Long usersId);

    int deleteByStudyInfoIdAndUsersId(Long studyinfoId, Long usersId);
}
