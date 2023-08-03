package com.spoon.sok.domain.user.repository;

import com.spoon.sok.domain.user.entity.UserStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStudyRepository  extends JpaRepository<UserStudy, Long> {
    List<UserStudy> findByStudyInfoIdEquals(Long studyinfoId);
}
