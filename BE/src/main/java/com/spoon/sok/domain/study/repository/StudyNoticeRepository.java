package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.entity.StudyNotice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyNoticeRepository extends JpaRepository<StudyNotice, Long> {

    Page<StudyNotice> findByStudyInfo(StudyInfo studyInfo, Pageable pageable);
}
