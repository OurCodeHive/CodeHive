package com.spoon.sok.domain.study.entity;

import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.entity.UserStudy;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Getter
@Entity
@Transactional
@Table(name = "study_info")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyinfo_id") // 스터디 정보키
    private Long id;

    @Column(name = "title") //스터디룸 이름
    private String title;

    @Column(name = "studyroom_size") // 스터디 참여인원
    private String studyroomSize;

    @Lob
    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description; // 스터디 설명

    @Column(name = "profileimage") // 스터디 대표(프로필) 이미지
    private String profileImage;

    @Column(name = "enter_name") // 스터디회의(웹IDE접속 스터디룸 이름, 유니크)
    private String enterName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startAt; // 스터디 그룹 시작일(기간설정 - 시작)

    @Temporal(TemporalType.TIMESTAMP)
    private Date endAt; // 스터디 그룹 종료일(기간설정 - 종료)

    // user_study 유저스터디 중간테이블과 일대다 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    private List<UserStudy> userStudyList = new ArrayList<>();

    //users 유저테이블과 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User users; // 스터디 그룹의 장

    //study_archive 스터디자료 테이블과 일대다 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    private List<StudyArchive> archiveList = new ArrayList<>(); // 스터디 자료

//    chat 채팅 테이블과 일대다 관계
//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
//    private List<Chat> chatList = new ArrayList<>();

    //study_appointment 스터디미팅(회의) 테이블과 일대다 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    private List<StudyAppointment> meetingList = new ArrayList<>(); // 스터디 회의

    //study_notice 스터디공지사항과 일대다 관계
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "studyInfo")
    private List<StudyNotice> noticeList = new ArrayList<>(); // 스터디 공지사항


    @Builder
    public StudyInfo(Long id, String title, String studyroomSize, String description, String profileImage, String enterName, Date startAt, Date endAt, List<StudyAppointment> meetingList, User users) {
        this.id = id;
        this.title = title;
        this.studyroomSize = studyroomSize;
        this.description = description;
        this.profileImage = profileImage;
        this.enterName = enterName;
        this.startAt = startAt;
        this.endAt = endAt;
        this.meetingList = meetingList;
        this.users = users;
    }
    
    // 스터디 그룹 기간 설정 - 시작일 변경
    public void updateEndAt(Date endAt) {
        this.endAt = endAt;
    }
    
    // 스터디 그룹 기간 설정 - 종료일 변경
    public void updateStartAt(Date startAt) {
        this.startAt = startAt;
    }

    // 스터디 그룹의 방장 변경
    public void updateUsers(User user) {
        this.users = user;
    }
}