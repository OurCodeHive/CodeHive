package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.File;
import com.spoon.sok.domain.study.entity.StudyArchive;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyFileRepository extends JpaRepository<File, Long> {

    List<File> findByStudyArchive(StudyArchive studyArchive);

}
