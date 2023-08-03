package com.spoon.sok.domain.user.repository;

import com.spoon.sok.domain.user.entity.UserStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserStudyRepository  extends JpaRepository<UserStudy, Long> {
    List<UserStudy> findByStudyInfoIdEquals(Long studyinfoId);

    Optional<UserStudy> findByStudyInfoIdAndUsersId(Long studyinfoId, Long usersId);

    // 삭제된 레코드 개수를 반환
    int deleteByStudyInfoIdAndUsersId(Long studyinfoId, Long usersId);

}
