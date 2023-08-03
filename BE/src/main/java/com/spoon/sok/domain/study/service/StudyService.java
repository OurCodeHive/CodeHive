package com.spoon.sok.domain.study.service;

import com.spoon.sok.aws.S3Service;
import com.spoon.sok.domain.study.dto.queryDTO.*;
import com.spoon.sok.domain.study.dto.requestDTO.StudyAppointmentRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticeDTO;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.dto.requestDTO.DelegateRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticeDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticePreviewDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyUserListDTO;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.entity.StudyNotice;
import com.spoon.sok.domain.study.enums.CurrentStatus;
import com.spoon.sok.domain.study.enums.StudyUpdateResult;
import com.spoon.sok.domain.study.repository.StudyAppointmentRepository;
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
import java.util.Date;
import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StudyService {

    private final StudyRepository studyRepository;
    private final StudyNoticeRepository studyNoticeRepository;
    private final UserStudyRepository userStudyRepository;
    private final UserRepository userRepository;
    private final StudyAppointmentRepository studyAppointmentRepository;
    private final S3Service s3Service;

    public List<StudyAppointmentDTO> getStudyMeeting(String userId) {
        return studyRepository.findByUserIdStudyMeetingsQuery(userId);
    }

    public List<StudyAppointmentDTO> getTodayStudyMeeting(String today, String userId) {
        return studyRepository.findByTodayStudyMeetingsQuery(today, userId);
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
        studyRepository.saveUserStudyQuery(newStudy,
                studyCreationDto.getUsersId(),
                CurrentStatus.ACCEPT.toString(),
                studyCreationDto.getEmail());

        return newStudy; // studyinfo_id(PK)를 반환
    }

    @Transactional
    public Long setUserStudyForEmail(Long studyinfo_id, String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            studyRepository.saveUserStudyQuery(
                    studyinfo_id, null, CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);

        } else {
            studyRepository.saveUserStudyQuery(
                    studyinfo_id, String.valueOf(user.get().getId()), CurrentStatus.WAIT.toString(), email);
            // 여기서 바로 PK 알아내야함
            return studyRepository.findByStudyInfoAndStatusAndEmailQuery(studyinfo_id, CurrentStatus.WAIT.toString(), email);
        }
    }

    public Optional<PreCheckUserStudyDto> CheckEnterStudyGroupCondition(Long userstudy_id) {
        return studyRepository.findByUserStudyIdQuery(userstudy_id);
    }

    @Transactional
    public void updateStudyGroupStatus(ChangeUserStudyDto changeUserStudyDto) {
        studyRepository.saveUserStudyStatusQuery(changeUserStudyDto.getUsersId(),
                changeUserStudyDto.getUserstudyId());
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

    public List<StudyNoticePreviewDTO> getStudyNoticeBoard(Long studyInfoId, Pageable pageRequest) {
        Optional<StudyInfo> findStudyInfo = studyRepository.findById(studyInfoId);
        Page<StudyNotice> studyNoticePage = studyNoticeRepository.findByStudyInfo(findStudyInfo.get(), pageRequest);

        List<StudyNoticePreviewDTO> list = new ArrayList<>();

        for (StudyNotice sn : studyNoticePage) {
            StudyNoticePreviewDTO data = new StudyNoticePreviewDTO();
            data.setUploadAt(sn.getUploadAt());
            data.setNoticeTitle(sn.getNoticeTitle());
            data.setAuthorId(sn.getUser().getId());
            data.setNickName(sn.getUser().getNickname());
            data.setStudyboardId(sn.getId());

            list.add(data);
        }

        return list;
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

    /*
    public List<StudyDocumentDTO> getStudyDocuments(Long studyInfoId, int page, int size) {
    }

    public List<StudyAppointmentDTO> getStudyMeetingByStudyId(Long studyInfoId) {
    }

    public boolean createStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean updateStudyMeeting(Long studyInfoId, String title, String description, LocalDate date, LocalTime startTime, LocalTime endTime) {
    }

    public boolean deleteStudyMeeting(Long studyInfoId, Long studyAppointmentId) {
    }

    public boolean leaveStudy(String email, String nickname, Long studyInfoId) {
    }

    public boolean forceLeaveStudy(String email, String nickname, Long studyInfoId) {
    }

    public StudyUpdateResult studyUpdateResult(StudyMemberRequestDTO studyMemberRequestDTO) {
    }
     */

    public List<StudyUserListDTO> getStudyUsers(Long studyInfoId) {
        // 중간테이블 가져오기
        List<UserStudy> userStudyList = userStudyRepository.findByStudyInfoIdEquals(studyInfoId);
        List<StudyUserListDTO> result = new ArrayList<>();

        for (UserStudy us : userStudyList) {
            StudyUserListDTO data = new StudyUserListDTO();

            data.setUserId(us.getUsers().getId());
            data.setNickName(us.getUsers().getNickname());
            data.setEmail(us.getUsers().getEmail());
            data.setStatus(us.getStatus());

            log.info("여기야 {}", us.getUsers().getId());
            log.info("여기야 {}", us.getUsers().getNickname());
            log.info("여기야 {}", us.getUsers().getEmail());
            log.info("여기야 {}", us.getStatus());

            result.add(data);
        }
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
}
