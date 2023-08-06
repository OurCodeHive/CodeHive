package com.spoon.sok.domain.study.repository;

import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.entity.StudyNotice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyNoticeRepository extends JpaRepository<StudyNotice, Long> {

    Page<StudyNotice> findByStudyInfo(StudyInfo studyInfo, Pageable pageable);

    @Query(value = "SELECT " +
            "    sn.studyboard_id, " +
            "    sn.content, " +
            "    sn.notice_title, " +
            "    sn.studyinfo_id, " +
            "    sn.upload_at, " +
            "    sn.users_id " +
            "FROM study_notice as sn " +
            "WHERE " +
            "    sn.studyinfo_id = :studyInfo AND sn.notice_title LIKE :title ", nativeQuery = true)
    List<StudyNotice> findByStudyInfoAndNoticeTitleContaining(@Param("studyInfo") Long studyInfo,
                                                              @Param("title") String title);
}
