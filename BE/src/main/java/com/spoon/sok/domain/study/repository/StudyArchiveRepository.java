package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyArchive;
import com.spoon.sok.domain.study.entity.StudyInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyArchiveRepository extends JpaRepository<StudyArchive, Long> {
    Page<StudyArchive> findByStudyInfo(StudyInfo studyInfo, Pageable pageable);
}
