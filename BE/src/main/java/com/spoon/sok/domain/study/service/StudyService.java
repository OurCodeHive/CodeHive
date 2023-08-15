package com.spoon.sok.domain.study.service;

import com.spoon.sok.aws.S3Service;
import com.spoon.sok.domain.study.dto.queryDTO.*;
import com.spoon.sok.domain.study.dto.requestDTO.LeaveStudyRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.*;
import com.spoon.sok.domain.study.entity.*;
import com.spoon.sok.domain.study.dto.requestDTO.DelegateRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.ForceLeaveRequestDTO;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.study.enums.StudyUpdateResult;
import com.spoon.sok.domain.study.repository.StudyAppointmentRepository;
import com.spoon.sok.domain.study.repository.StudyArchiveRepository;
import com.spoon.sok.domain.study.repository.StudyNoticeRepository;
import com.spoon.sok.domain.study.repository.StudyRepository;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.entity.UserStudy;
import com.spoon.sok.domain.user.repository.UserRepository;
import com.spoon.sok.domain.user.repository.UserStudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final S3Service s3Service;

    private final UserRepository userRepository;
    private final UserStudyRepository userStudyRepository;

    private final StudyRepository studyRepository;
    private final StudyNoticeRepository studyNoticeRepository;
    private final StudyArchiveRepository studyArchiveRepository;
    private final StudyAppointmentRepository studyAppointmentRepository;

//    public List<StudyAppointmentDTO> getStudyMeeting(String userId) {
//        return studyRepository.findByUserIdStudyMeetingsQuery(userId);
//    }

    public List<StudyAppointmentResponseDTO> getFormattedStudyMeeting(String userId) {
        List<StudyAppointmentDTO> studyMeetingList = studyRepository.findByUserIdStudyMeetingsQuery(userId);
        List<StudyAppointmentResponseDTO> responseDTOList = new ArrayList<>();

        for (StudyAppointmentDTO appointment : studyMeetingList) {
            StudyAppointmentResponseDTO responseDTO = StudyAppointmentResponseDTO.builder()
                    .id(appointment.getStudyinfoId())
                    .title(appointment.getTitle())
                    .meetingAt(appointment.getStartTime())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .build();

            responseDTOList.add(responseDTO);
        }
        return responseDTOList;
    }


//    public List<StudyAppointmentDTO> getTodayStudyMeeting(Date today, String userId) {
//        return studyRepository.findByTodayStudyMeetingsQuery(today, userId);
//    }

    public List<StudyAppointmentResponseDTO> getFormattedTodayStudyMeeting(Date today, String userId) {
        List<StudyAppointmentDTO> todayStudyMeetingList = studyRepository.findByTodayStudyMeetingsQuery(today, userId);
        List<StudyAppointmentResponseDTO> responseDTOList = new ArrayList<>();

        for (StudyAppointmentDTO appointment : todayStudyMeetingList) {
            StudyAppointmentResponseDTO responseDTO = StudyAppointmentResponseDTO.builder()
                    .id(appointment.getStudyinfoId())
                    .title(appointment.getTitle())
                    .meetingAt(appointment.getMeetingAt())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .build();

            responseDTOList.add(responseDTO);
        }

        return responseDTOList;
    }


    public List<StudyInfoDto> getUserStudyGroupProceeding(String userId) {
        return studyRepository.findByUserIdStudyInfoProceedingQuery(userId);
    }

    public List<StudyInfoDto> getUserStudyGroupClose(String userId) {
        return studyRepository.findByUserIdStudyInfoCloseQuery(userId);
    }

    public List<StudyInfoDto> searchUserStudyGroup(String userId, String title) {
        return studyRepository.findByUserIdAndTitleQuery(userId, title);
    }

    @Transactional
    public Long setStudyGroup(StudyCreationDto studyCreationDto, List<MultipartFile> fileList) throws IOException {

        // 웹 IDE 접속하기 위한 10글자 문자열 생성
        String enterName = UUID.randomUUID().toString().substring(0, 10);
        studyCreationDto.setEnterName(enterName);

        String imgUrl = "https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/basicImage.png";

        // S3로 파일 업로드하고 문자열 받아오기
        if (fileList != null) {
            imgUrl = s3Service.upload(fileList.get(0));
        }

        // 여기 코드 로직 몰라서 더이상 못짜겠슴
        studyRepository.saveStudyGroup(
                studyCreationDto.getUsersId(),
                studyCreationDto.getTitle(),
                studyCreationDto.getDescription(),
                studyCreationDto.getEnterName(),
                studyCreationDto.getStartAt(),
                studyCreationDto.getEndAt(),
                imgUrl
        );

        // 최조 스터디 그룹을 만드는 사람은 바로 중간테이블에 저장(스터디 장)
        Long newStudy = studyRepository.findByEnterNameQuery(studyCreationDto.getEnterName());
        userStudyRepository.saveUserStudyQuery(
                newStudy,
                studyCreationDto.getUsersId(),
                CurrentStatus.ACCEPT.toString(),
                studyCreationDto.getEmail()
        );

        return newStudy; // studyinfo_id(PK)를 반환
    }

    @Transactional
    public Long setUserStudyForEmail(Long studyinfo_id, String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            userStudyRepository.saveUserStudyQuery(
                    studyinfo_id, null, CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return userStudyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);

        } else {
            userStudyRepository.saveUserStudyQuery(
                    studyinfo_id, String.valueOf(user.get().getId()), CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return userStudyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);
        }
    }

    public Long getUserStudyId(Long studyinfoId, String status, String email) {
        return userStudyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfoId, CurrentStatus.WAIT.toString(), email);
    }

    public Optional<PreCheckUserStudyDto> CheckEnterStudyGroupCondition(Long userstudy_id) {
        return studyRepository.findByUserStudyIdQuery(userstudy_id);
    }

    @Transactional
    public void updateStudyGroupStatus(ChangeUserStudyDto changeUserStudyDto) {
        userStudyRepository.saveUserStudyStatusQuery(changeUserStudyDto.getUsersId(),
                                                 changeUserStudyDto.getUserstudyId(),
                                                 changeUserStudyDto.convertCurrentStatus());
    }


    public Optional<StudyInfoDetailDto> getStudyInfoAll(String studyinfoId) {
        return studyRepository.findByStudyInfoIdQuery(studyinfoId);
    }

    //////////////////////////////////// here
    // Long pk -> Long id 로 수정
    @Transactional
    public StudyUpdateResult updateStudyGroup(Long id, StudyInfo studyUpdateDTO) {
        Optional<StudyInfo> target = studyRepository.findById(id);

        if (target.isPresent()) {
            StudyInfo studyInfo = target.get();
//            studyInfo.updateTitle(studyUpdateDTO.getTitle());
            studyInfo.updateStartAt(studyUpdateDTO.getStartAt());
            studyInfo.updateEndAt(studyUpdateDTO.getEndAt());


            studyRepository.save(studyInfo); // 생략 가능
            return StudyUpdateResult.SUCCESS;
        }

        return StudyUpdateResult.NOT_FOUND;
    }


    @Transactional
    public boolean createStudyNotice(Long studyinfoId, StudyNoticeDTO notice) {
        Optional<StudyInfo> findStudyInfo = studyRepository.findById(studyinfoId);
        Optional<User> author = userRepository.findById(notice.getAuthorId());

        StudyNotice savedNotice = studyNoticeRepository.save(notice.toEntity(author.get(), findStudyInfo.get()));
        if (savedNotice != null) return true;
        else return false;
    }

    public List<StudyNotice> searchStudyNoticeBoard(Long studyInfoId, String title) {
        Optional<StudyInfo> findStudyInfo = studyRepository.findById(studyInfoId);
        title = "%" + title + "%";
        return studyNoticeRepository.findByStudyInfoAndNoticeTitleContaining(studyInfoId, title);
    }

    public Map<String, Object> getStudyNoticeBoard(Long studyInfoId, Pageable pageRequest) {
        Optional<StudyInfo> findStudyInfo = studyRepository.findById(studyInfoId);
        Page<StudyNotice> studyNoticePage = studyNoticeRepository.findByStudyInfo(findStudyInfo.get(), pageRequest);

        List<StudyNoticePreviewDTO> list = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();

        for (StudyNotice sn : studyNoticePage) {
            StudyNoticePreviewDTO data = new StudyNoticePreviewDTO();

            data.setUploadAt(sn.getUploadAt());
            data.setNoticeTitle(sn.getNoticeTitle());
            data.setAuthorId(sn.getUser().getId());
            data.setNickName(sn.getUser().getNickname());
            data.setStudyboardId(sn.getId());

            list.add(data);
        }

        result.put("studyNoticeList", list);
        result.put("totalCnt", studyNoticePage.getTotalElements());

        return result;
    }

    public Optional<StudyNotice> getStudyNoticeList(Long studyboardId) {
        return studyNoticeRepository.findById(studyboardId);
    }

    @Transactional
    public boolean updateStudyNotice(Long studyBoardId, StudyNoticeDTO notice) {
        Optional<StudyNotice> targetNotice = studyNoticeRepository.findById(studyBoardId);

        if (targetNotice.isPresent()) {
            targetNotice.get().setNoticeTitle(notice.getNoticeTitle());
            targetNotice.get().setContent(notice.getContent());
            targetNotice.get().setUploadAt(notice.getUploadAt());

            studyNoticeRepository.save(targetNotice.get());
            return true;
        }
        return false;
    }
    
    // 스터디 회의를 등록하는 메서드
    @Transactional
    public boolean createStudyAppointment(Long studyInfoId, StudyAppointment studyAppointment) {
        // 스터디 정보 조회 (studyInfoId를 사용하여 스터디 정보를 가져옴)
        Optional<StudyInfo> targetStudy = studyRepository.findById(studyInfoId);
        if (!targetStudy.isPresent()) {
            return false; // 스터디 정보가 없으면 등록 실패
        }

        StudyInfo studyInfo = targetStudy.get();
        // 스터디 회의를 스터디 정보와 연결하여 저장
        studyAppointment.setStudyInfo(studyInfo);
        studyAppointmentRepository.save(studyAppointment);

        return true; // 등록 성공
    }

    // 스터디 회의를 조회하는 메서드
    @Transactional
    // 스터디 정보 ID로 해당 스터디에 생성된 모든 스터디 회의 조회
    public List<StudyAppointment> getAllStudyAppointmentsByStudyInfoId(Long studyInfoId) {
        return studyAppointmentRepository.findByStudyInfoId(studyInfoId);
    }


    // 스터디 회의를 수정하는 메서드
    @Transactional
    public boolean updateStudyAppointment(Long studyInfoId, Long appointmentId, StudyAppointment studyAppointmentResponseDTO) {
        Optional<StudyAppointment> target = studyAppointmentRepository.findById(appointmentId);
        if (!target.isPresent()) {
            return false; // 수정하려는 스터디 회의가 없을 때
        }

        StudyAppointment existingStudyAppointment = target.get();
        if (!existingStudyAppointment.getStudyInfo().getId().equals(studyInfoId)) {
            return false; // 스터디 회의와 스터디 정보가 매칭되지 않을 때(
        }

        existingStudyAppointment.updateTitle(studyAppointmentResponseDTO.getTitle());
        existingStudyAppointment.updateMeetingAt(studyAppointmentResponseDTO.getMeetingAt());
        existingStudyAppointment.updateStartTime(studyAppointmentResponseDTO.getStartTime());
        existingStudyAppointment.updateEndTime(studyAppointmentResponseDTO.getEndTime());

        // 스터디 회의 저장
        studyAppointmentRepository.save(existingStudyAppointment);
        return true; // 수정 성공
    }

    // 스터디 회의를 삭제하는 메서드
    public boolean deleteStudyAppointment(Long studyInfoId, Long appointmentId) {
        // 스터디 정보 조회 (studyInfoId를 사용하여 스터디 정보를 가져옴)
        Optional<StudyInfo> targetStudy = studyRepository.findById(studyInfoId);
        if (!targetStudy.isPresent()) {
            return false; // 스터디 정보가 없으면 삭제 실패
        }

        // 스터디 회의 조회 (appointmentId를 사용하여 스터디 회의 정보를 가져옴)
        Optional<StudyAppointment> targetAppointment = studyAppointmentRepository.findById(appointmentId);
        if (!targetAppointment.isPresent()) {
            return false; // 스터디 회의가 없으면 삭제 실패
        }

        StudyInfo studyInfo = targetStudy.get();
        StudyAppointment studyAppointment = targetAppointment.get();

        // 스터디 회의와 스터디 정보가 매칭되는지 확인
        if (!studyAppointment.getStudyInfo().getId().equals(studyInfoId)) {
            return false; // 스터디 회의와 스터디 정보가 매칭되지 않을 때 삭제 실패
        }
        
        studyAppointmentRepository.delete(studyAppointment);

        return true; // 삭제 성공
    }

    @Transactional
    public boolean deleteStudyNotice(Long studyBoardId) {
        Optional<StudyNotice> findStudyNotice = studyNoticeRepository.findById(studyBoardId);

        if (findStudyNotice.isPresent()) {
            studyNoticeRepository.delete(findStudyNotice.get());
            return true;
        } else {
            return false;
        }
    }

    public Map<String, Object> getStudyDocuments(Long studyInfoId, Pageable pageRequest) {
        Optional<StudyInfo> findStudyInfo = studyRepository.findById(studyInfoId);
        Page<StudyArchive> studyArchivePage = studyArchiveRepository.findByStudyInfo(findStudyInfo.get(), pageRequest);

        List<StudyDocumentDTO> list = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();

        for (StudyArchive sa : studyArchivePage) {
            StudyDocumentDTO data = new StudyDocumentDTO();

            data.setId(sa.getId());
            data.setTitle(sa.getTitle());
            data.setContent(sa.getContent());
            data.setAuthor(sa.getUsers().getNickname());
            data.setUploadAt(sa.getUploadAt());

            for (File file : sa.getFileList()) {
                data.getDocumentUrl().add(file.getPath());
            }

            list.add(data);
        }

        result.put("studyArchives", list);
        result.put("totalCnt", studyArchivePage.getTotalElements());

        return result;
    }

    /*

    public List<StudyAppointmentDTO> getStudyMeetingByStudyId(Long studyInfoId) {
    }

    public boolean createStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean updateStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean deleteStudyMeeting(Long studyInfoId, Long studyAppointmentId) {
    }

    public StudyUpdateResult studyUpdateResult(StudyMemberRequestDTO studyMemberRequestDTO) {
    }
     */

    @Transactional
    public boolean leaveStudy(LeaveStudyRequestDTO leaveStudyRequestDTO) {

        Optional<StudyInfo> si = studyRepository.findById(leaveStudyRequestDTO.getStudyinfoId());

        // 방장이 나가려하면 위임하고 나가야 하므로, false
        if (si.get().getUsers().getId().equals(leaveStudyRequestDTO.getUserId())) {
            return false;
        }

        int deleteCount = userStudyRepository.deleteByStudyInfoIdAndUsersId(
                leaveStudyRequestDTO.getStudyinfoId(), leaveStudyRequestDTO.getUserId()
        );

        if (deleteCount > 0) return true;

        return false;
    }

    @Transactional
    public boolean forceLeaveStudy(ForceLeaveRequestDTO forceLeaveRequestDTO) {

        Optional<StudyInfo> si = studyRepository.findById(forceLeaveRequestDTO.getStudyinfoId());
        if (si.isPresent()) {
            // 방장만 강퇴시킨다.
            if (!si.get().getUsers().getId().equals(forceLeaveRequestDTO.getFrom())) {
                return false;
            }
        }

        // 스터디 그룹과 강퇴할 유저 조건으로 중간테이블의 데이터를 불러온다.
        Optional<UserStudy> us = userStudyRepository.findByStudyInfoIdAndUsersId(
                forceLeaveRequestDTO.getStudyinfoId(), forceLeaveRequestDTO.getTarget()
        );

        if (us.isPresent()) {
            if (us.get().getStatus().equals(CurrentStatus.ACCEPT)) {
                us.get().updateStatus(CurrentStatus.BAN); // 중간테이블의 상태를 변경
                userStudyRepository.save(us.get());
                return true;
            }
        }
        return false;
    }

    public Map<String, Object> getStudyUsers(Long studyInfoId, Pageable pageRequest) {
        // 중간테이블 가져오기
        Page<UserStudy> userStudyPage = userStudyRepository.findByStudyInfoId(studyInfoId, pageRequest);

        Map<String, Object> result = new HashMap<>();
        List<StudyUserListDTO> list = new ArrayList<>();

        for (UserStudy us : userStudyPage) {
            StudyUserListDTO data = new StudyUserListDTO();
            if (us.getUsers() != null) {
                data.setUserId(us.getUsers().getId());
                data.setNickName(us.getUsers().getNickname());
                data.setEmail(us.getUsers().getEmail());
                data.setStatus(us.getStatus());

                list.add(data);
            } else {
                data.setUserId(-1L);
                data.setNickName("비회원");
                data.setEmail(us.getInviteEmail());
                data.setStatus(us.getStatus());

                list.add(data);
            }
        }

        result.put("userList", list);
        result.put("totalCnt", userStudyPage.getTotalElements());

        return result;
    }

    public Map<String, Object> getStudyUserForChat(Long studyInfoId) {
        List<UserStudy> db = userStudyRepository.findByStudyInfoId(studyInfoId);

        Map<String, Object> result = new HashMap<>();
        List<StudyUserListDTO> list = new ArrayList<>();

        for (UserStudy us : db) {
            StudyUserListDTO data = new StudyUserListDTO();
            if (us.getUsers() != null) {
                data.setUserId(us.getUsers().getId());
                data.setNickName(us.getUsers().getNickname());
                data.setEmail(us.getUsers().getEmail());
                data.setStatus(us.getStatus());

                list.add(data);
            } else {
                data.setUserId(-1L);
                data.setNickName("비회원");
                data.setEmail(us.getInviteEmail());
                data.setStatus(us.getStatus());

                list.add(data);
            }
        }
        result.put("userList", list);
        return result;
    }

    @Transactional
    public boolean delegateStudyOwnership(DelegateRequestDTO delegateRequestDTO) {
        Optional<StudyInfo> targetStudyInfo = studyRepository.findById(delegateRequestDTO.getStudyinfoId());
        Optional<User> toUser = userRepository.findById(delegateRequestDTO.getTo());

        if (targetStudyInfo.isPresent() && toUser.isPresent()) {
            targetStudyInfo.get().updateUsers(toUser.get());
            studyRepository.save(targetStudyInfo.get());
            return true;
        } else {
            return false;
        }
    }

    public StudyArchiveDTO getStudyArchive(Long studyarchiveId) {
        Optional<StudyArchive> sa = studyArchiveRepository.findById(studyarchiveId);

        StudyArchiveDTO data = new StudyArchiveDTO();
        if (sa.isPresent()) {
            data.setId(sa.get().getId());
            data.setTitle(sa.get().getTitle());
            data.setContent(sa.get().getContent());
            data.setUploadAt(sa.get().getUploadAt());
            data.setUserId(sa.get().getUsers().getId());
            data.setNickname(sa.get().getUsers().getNickname());
            data.setFileList(sa.get().getFileList());
        }

        return data;
    }
}
