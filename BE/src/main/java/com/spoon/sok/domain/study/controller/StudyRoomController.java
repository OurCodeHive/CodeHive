package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.requestDTO.StudyAppointmentRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.StudyMeetingRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyAppointmentResponseDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyErrorResponseDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticeDTO;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import com.spoon.sok.domain.study.dto.requestDTO.DelegateRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.ForceLeaveRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticePreviewDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyUserListDTO;
import com.spoon.sok.domain.study.entity.StudyInfo;
import com.spoon.sok.domain.study.enums.StudyUpdateResult;
import com.spoon.sok.domain.study.entity.StudyNotice;
import com.spoon.sok.domain.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudyRoomController {

    private final StudyService studyService;

    @PutMapping("/study/{studyinfoId}")
    public ResponseEntity<Map<String, Object>> updateStudyGroup(
            @PathVariable("studyinfoId") Long studyinfoId, @RequestBody StudyMeetingRequestDTO studyMeetingRequestDTO) {

        StudyInfo studyInfo = studyMeetingRequestDTO.toEntity(); // StudyMeetingRequestDTO를 StudyInfo로 변환

        // 수정된 studyInfo를 전달
        StudyUpdateResult result = studyService.updateStudyGroup(studyinfoId, studyInfo);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        response.put("result", result); // Update 결과 추가 (필요에 따라 다른 정보도 추가 가능)

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/study/{studyinfo_id}/board")
    public ResponseEntity<?> createStudyNotice(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @RequestBody StudyNoticeDTO studyNoticeDTO) {

        boolean isCreated = studyService.createStudyNotice(studyInfoId, studyNoticeDTO);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (isCreated) {
            response.put("status", 200);
            response.put("message", "공지사항이 등록되었습니다.");
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 등록에 실패하였습니다.");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/study/{studyinfo_id}/board")
    public ResponseEntity<Map<String, Object>> getStudyNoticeBoard(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {

        Pageable pageRequest = PageRequest.of(page, size);
        List<StudyNoticePreviewDTO> studyNoticeBoard = studyService.getStudyNoticeBoard(studyInfoId, pageRequest);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (studyNoticeBoard != null) {
            response.put("status", 200);
            response.put("studyNoticeBoard", studyNoticeBoard);
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 조회에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/study/{studyinfo_id}/board/{studyboard_id}")
    public ResponseEntity<Map<String, Object>> getStudyNotice(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("studyboard_id") Long studyboardId) {

        // 스터디 공지사항 조회 서비스 호출
        Optional<StudyNotice> studyNotice = studyService.getStudyNoticeList(studyboardId);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (studyNotice != null) {
            response.put("status", 200);
            response.put("studyNotice", studyNotice);
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 조회에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/study/{studyinfo_id}/board/{studyboard_id}")
    public ResponseEntity<Map<String, Object>> updateStudyNotice(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("studyboard_id") Long studyBoardId,
            @RequestBody StudyNoticeDTO studyNoticeDTO) {

        // 스터디 공지사항 수정 서비스 호출
        boolean isUpdated = studyService.updateStudyNotice(studyBoardId, studyNoticeDTO);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (isUpdated) {
            response.put("status", 200);
            response.put("message", "공지사항을 수정하였습니다.");
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 수정에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/study/{studyinfo_id}/board/{studyboard_id}")
    public ResponseEntity<Map<String, Object>> deleteStudyNotice(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("studyboard_id") Long studyBoardId) {

        // 스터디 공지사항 삭제 서비스 호출
        boolean isDeleted = studyService.deleteStudyNotice(studyBoardId);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (isDeleted) {
            response.put("status", 200);
            response.put("message", "공지사항이 성공적으로 삭제되었습니다.");
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 삭제에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /*
//     [스터디룸] 스터디 자료 조회
//     [GET] api/study/{studyinfo_id}/document?page={int}&size={int}
    @GetMapping("/study/{studyinfo_id}/document")
    public ResponseEntity<Map<String, Object>> getStudyDocuments(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {

        // 스터디 자료 서비스 호출
        List<StudyDocumentDTO> studyDocuments = studyService.getStudyDocuments(studyInfoId, page, size);

        // 응답 메세지 설정
        Map<String, Object> response = new HashMap<>();
        if (studyDocuments != null) {
            response.put("status", 200);
            response.put("study_documents", studyDocuments);
        } else {
            response.put("status", 400);
            response.put("message", "스터디 자료 조회에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // [스터디룸] 스터디 자료 다운로드

    // [스터디룸] 채팅 메세지 전송

    // [스터디룸] 채팅에 첨부파일 전송

*/
    // [스터디름] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 등록
    @PostMapping("/study/meeting/{studyinfo_id}")
    public ResponseEntity<?> createStudyAppointment(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @RequestBody StudyAppointmentRequestDTO studyAppointmentRequestDTO) {

        // 스터디 회의 등록 정보를 StudyAppointmentRequestDTO로 받아옴
        // 받아온 DTO의 toEntity함수를 이용해서 엔티티로 변환시켜준다.
        StudyAppointment studyAppointment = studyAppointmentRequestDTO.toEntity();

        // 스터디 회의 등록 서비스 호출
        boolean isCreated = studyService.createStudyAppointment(studyInfoId, studyAppointment);
        // 응답 메시지 설정
        if (isCreated) {
            // 스터디 회의가 성공적으로 등록된 경우, 등록된 정보를 응답으로 반환
            StudyAppointmentResponseDTO studyAppointmentResponseDTO = new StudyAppointmentResponseDTO(
                    studyAppointment.getId(),
                    studyAppointment.getTitle(),
                    studyAppointment.getMeetingAt(),
                    studyAppointment.getStartTime(),
                    studyAppointment.getEndTime()
            );
            return new ResponseEntity<>(studyAppointmentResponseDTO, HttpStatus.OK);
        } else {
            // 등록에 실패한 경우 에러 응답 반환
            StudyErrorResponseDTO studyErrorResponseDTO = new StudyErrorResponseDTO(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "스터디 회의 등록에 실패했습니다."
            );
            return new ResponseEntity<>(studyErrorResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // [스터디룸] (스터디 장, 스터디 팀원) 일정 보기를 누르면 활성화된 달력 창이 보여짐
    // [GET] [api/study/meeting/{studyinfo_id}
    @GetMapping("/study/meeting/{studyinfo_id}")
    public ResponseEntity<?> getAllStudyAppointmentsByStudyInfoId(@PathVariable("studyinfo_id") Long studyInfoId) {
        // 해당 스터디에 생성된 모든 스터디 회의 조회 서비스 호출
        List<StudyAppointment> studyAppointments = studyService.getAllStudyAppointmentsByStudyInfoId(studyInfoId);
        if (!studyAppointments.isEmpty()) {
            // 조회된 스터디 회의 정보들을 응답으로 반환
            List<StudyAppointmentResponseDTO> studyAppointmentResponseDTO = studyAppointments.stream()
                    .map(studyAppointment -> new StudyAppointmentResponseDTO(
                            studyAppointment.getId(),
                            studyAppointment.getTitle(),
                            studyAppointment.getMeetingAt(),
                            studyAppointment.getStartTime(),
                            studyAppointment.getEndTime()
                    ))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(studyAppointmentResponseDTO, HttpStatus.OK);
        } else {
            // 조회된 스터디 회의 정보가 없을 때 에러 응답 반환
            StudyErrorResponseDTO studyErrorResponseDTO = new StudyErrorResponseDTO(
                    HttpStatus.NOT_FOUND.value(),
                    "해당 스터디 정보에 묶인 스터디 회의 정보를 찾을 수 없습니다."
            );
            return new ResponseEntity<>(studyErrorResponseDTO, HttpStatus.NOT_FOUND);
        }
    }

    // [스터디룸] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 수정
    // [PUT] [api/study/meeting/{study_info_id}
    @PutMapping("/study/{studyinfo_id}/meeting/{appointment_id}")
    public ResponseEntity<?> updateStudyAppointment(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("appointment_id") Long appointmentId,
            @RequestBody StudyAppointmentRequestDTO studyAppointmentRequestDTO) {

        // 스터디 회의 수정 정보를 StudyAppointmentRequestDTO로 받아옴
        StudyAppointment studyAppointment = studyAppointmentRequestDTO.toEntity();

        // 스터디 회의 수정 서비스 호출
        boolean isUpdated = studyService.updateStudyAppointment(studyInfoId, appointmentId, studyAppointment);

        // 수정 결과에 따라 응답 메시지 설정
        if (isUpdated) {
            return new ResponseEntity<>("스터디 회의가 성공적으로 수정되었습니다.", HttpStatus.OK);
        } else {
            StudyErrorResponseDTO studyErrorResponseDTO = new StudyErrorResponseDTO(
                    HttpStatus.NOT_FOUND.value(),
                    "해당 스터디 정보에 묶인 스터디 회의를 찾을 수 없거나 수정에 실패했습니다."
            );
            return new ResponseEntity<>(studyErrorResponseDTO, HttpStatus.NOT_FOUND);
        }
    }

    // [스터디룸] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 삭제
    // [DELETE] [api/study/{studyinfo_id}/meeting/{study_appointment_id}]
    @DeleteMapping("/study/{studyinfo_id}/meeting/{appointment_id}")
    public ResponseEntity<?> deleteStudyAppointment(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("appointment_id") Long appointmentId) {

        // 스터디 회의 삭제 서비스 호출
        boolean isDeleted = studyService.deleteStudyAppointment(studyInfoId, appointmentId);

        // 삭제 결과에 따라 응답 메시지 설정
        if (isDeleted) {
            return new ResponseEntity<>("스터디 회의가 성공적으로 삭제되었습니다.", HttpStatus.OK);
        } else {
            StudyErrorResponseDTO studyErrorResponseDTO = new StudyErrorResponseDTO(
                    HttpStatus.NOT_FOUND.value(),
                    "해당 스터디 정보에 묶인 스터디 회의를 찾을 수 없거나 삭제에 실패했습니다."
            );
            return new ResponseEntity<>(studyErrorResponseDTO, HttpStatus.NOT_FOUND);
        }
    }

//    // [스터디룸] 스터디 나가기
//    // [POST] [api/study/leave]
//    @PostMapping("/study/leave")
//    public ResponseEntity<Map<String, Object>> leaveStudy(
//            @RequestBody LeaveStudyRequestDTO leaveStudyRequestDTO) {
//
//        // 요청으로 받아온 데이터를 추출
//        String email = leaveStudyRequestDTO.getEmail();
//        String nickname = leaveStudyRequestDTO.getNickname();
//        Long studyInfoId = leaveStudyRequestDTO.getStudyInfoId();
//
//        // 스터디 나가기 서비스 호출
//        boolean isLeft = studyService.leaveStudy(email, nickname, studyInfoId);
//
//        // 응답 메시지 설정
//        Map<String, Object> response = new HashMap<>();
//        if (isLeft) {
//            response.put("status", 200);
//            response.put("message", "스터디를 성공적으로 나갔습니다.");
//        } else {
//            response.put("status", 400);
//            response.put("message", "스터디 나가기에 실패하였습니다.");
//        }
//
//        // HTTP 응답 반환
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    // [스터디룸] (스터디 장이 그룹원을 추방시킴) 스터디 그룹원 강퇴
//    // [POST] [api/study/force/leave]
//    @PostMapping("/study/force/leave")
//    public ResponseEntity<Map<String, Object>> forceLeaveStudy(@RequestBody LeaveStudyRequestDTO leaveStudyRequestDTO) {
//        // 요청으로 받아온 데이터를 추출
//        String email = leaveStudyRequestDTO.getEmail();
//        String nickname = leaveStudyRequestDTO.getNickname();
//        Long studyInfoId = leaveStudyRequestDTO.getStudyInfoId();
//
//        // 스터디 그룹원 강퇴 서비스 호출
//        boolean isForcedLeave = studyService.forceLeaveStudy(email, nickname, studyInfoId);
//
//        // 응답 메시지 설정
//        Map<String, Object> response = new HashMap<>();
//        if (isForcedLeave) {
//            response.put("status", 200);
//            response.put("message", "스터디 그룹원을 성공적으로 강퇴하였습니다.");
//        } else {
//            response.put("status", 400);
//            response.put("message", "스터디 그룹원 강퇴에 실패하였습니다.");
//        }
//
//        // HTTP 응답 반환
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

    // [스터디룸] (스터디 장이 그룹원을 추방시킴) 스터디 그룹원 강퇴
    // [POST] [api/study/force/leave]
    @PostMapping("/study/force/leave")
    public ResponseEntity<Map<String, Object>> forceLeaveStudy(
            @RequestBody ForceLeaveRequestDTO forceLeaveRequestDTO) {

        // 스터디 그룹원 강퇴 서비스 호출
        boolean isForcedLeave = studyService.forceLeaveStudy(forceLeaveRequestDTO);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (isForcedLeave) {
            response.put("status", 200);
            response.put("message", "스터디 그룹원을 성공적으로 강퇴하였습니다.");
        } else {
            response.put("status", 400);
            response.put("message", "스터디 그룹원 강퇴에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/study/user/list")
    public ResponseEntity<Map<String, Object>> getStudyUsers(@RequestParam("study") Long studyInfoId) {
        List<StudyUserListDTO> studyUserList = studyService.getStudyUsers(studyInfoId);

        Map<String, Object> response = new HashMap<>();

        if (!studyUserList.isEmpty()) {
            response.put("status", 200);
            response.put("studyUserList", studyUserList);
        } else {
            response.put("status", 400);
            response.put("message", "스터디에 소속된 유저 목록 조회에 실패하였습니다.");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/study/delegate")
    public ResponseEntity<Map<String, Object>> delegateStudyOwnership(@RequestBody DelegateRequestDTO requestDto) {

        // 스터디장 위임 서비스 호출
        boolean isDelegated = studyService.delegateStudyOwnership(requestDto);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (isDelegated) {
            response.put("status", 200);
            response.put("message", "스터디장 권한이 성공적으로 위임되었습니다.");
        } else {
            response.put("status", 400);
            response.put("message", "스터디장 권한 위임에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
