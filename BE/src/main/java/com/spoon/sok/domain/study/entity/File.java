package com.spoon.sok.domain.study.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "file")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(name = "filesize") // 파일용량
    private Long fileSize;

    @Column(name = "origin_name") // 유저에게 보여지는 이름
    private String originName;

    @Column(name = "real_name") // 유니크한 이름
    private String realName;

    @Column(name = "path") // S3를 통해 다운받는 경로
    private  String path;

    @Column(name = "etc") // 확장자
    private String etc;

    // study_archive 스터디자료 테이블과 다대일 관계
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyarchive_id", nullable = false)
    private StudyArchive studyArchive;

    @Builder
    public File (Long fileSize, String originName, String realName, String path, String etc, StudyArchive studyArchive) {
        this.fileSize = fileSize;
        this.originName = originName;
        this.realName = realName;
        this.path = path;
        this.etc = etc;
        this.studyArchive = studyArchive;
    }
}
