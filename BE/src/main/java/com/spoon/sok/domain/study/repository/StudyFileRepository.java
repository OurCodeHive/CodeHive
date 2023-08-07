package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyFileRepository extends JpaRepository<File, Long> {
}
