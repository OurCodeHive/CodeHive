package com.spoon.sok.domain.study.controller;

import com.spoon.sok.domain.study.dto.requestDTO.StudyAppointmentRequestDTO;
import com.spoon.sok.domain.study.dto.requestDTO.StudyMeetingRequestDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyAppointmentResponseDTO;
import com.spoon.sok.domain.study.dto.responseDTO.StudyNoticeDTO;
import com.spoon.sok.domain.study.entity.StudyAppointment;
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

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")

public class StudyRoomController {

    private final StudyService studyService;

    // [스터디룸] 스터디 그룹 기간 수정
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

    // [스터디룸] 스터디 공지사항 등록
    // [POST] api/study/{studyinfo_id}/board
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

    // [스터디룸] 스터디 공지사항 조회
    // [GET] api/study/{studyinfo_id}/board?page={int}&size={int}
    @GetMapping("/study/{studyinfo_id}/board")
    public ResponseEntity<Map<String, Object>> getStudyNoticeList(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @RequestParam("page") int page,
            @RequestParam("size") int size) {

        Pageable pageRequest = PageRequest.of(page, size);
        // 스터디 공지사항 조회 서비스 호출
        List<StudyNotice> studyNoticeList = studyService.getStudyNoticeList(studyInfoId, pageRequest);

        // 응답 메시지 설정
        Map<String, Object> response = new HashMap<>();
        if (studyNoticeList != null) {
            response.put("status", 200);
            response.put("studyNoticeList", studyNoticeList);
        } else {
            response.put("status", 400);
            response.put("message", "공지사항 조회에 실패하였습니다.");
        }

        // HTTP 응답 반환
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // [스터디룸] 스터디 관련 공지사항 수정
    // [PUT] api/study/{studyinfo_id}/board/{studyboard_id}
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

    /*
    // [스터디룸] 스터디 관련 공지사항 삭제
    // [DELETE] api/study/{studyinfo_id}/board/{studyinfo_id}
    @DeleteMapping("/study/{studyinfo_id}/board/{studyboard_id}")
    public ResponseEntity<Map<String, Object>> deleteStudyNotice(
            @PathVariable("studyinfo_id") Long studyInfoId,
            @PathVariable("studyboard_id") Long studyBoardId) {

        // 스터디 공지사항 삭제 서비스 호출
        boolean isDeleted = studyService.deleteStudyNotice(studyInfoId, studyBoardId);

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

    // [스터디룸] (스터디 장, 스터디 팀원) 일정 보기를 누르면 활성화된 달력 창이 보여짐
    // [GET] [api/study/meeting/{study_info_id}
    @GetMapping("/study/meeting/{study_info_id}")
    public ResponseEntity<Map<String, Object>> getStudyMeeting(@PathVariable("study_info_id") Long studyInfoId) {
        List<StudyAppointmentDTO> studyMeetingList = studyService.getStudyMeetingByStudyId(studyInfoId);

        Map<String, Object> response = new HashMap<>();

        if (!studyMeetingList.isEmpty()) {
            List<Map<String, String>> calendar = new ArrayList<>();

            for (StudyAppointmentDTO appointment : studyMeetingList) {
                Map<String, String> entry = new HashMap<>();
                entry.put("title", appointment.getTitle());
                entry.put("day", appointment.getDay());
                entry.put("start_time", appointment.getStartTime());
                entry.put("end_time", appointment.getEndTime());
                entry.put("date", appointment.getDate());
                calendar.add(entry);
            }

            response.put("calendar", calendar);
        } else {
            response.put("status", 400);
            response.put("message", "스터디 회의 일정을 불러오는데 실패하였습니다.");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

     */

    // [스터디름] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 등록
//    @PostMapping("/meeting/{studyinfo_id}")
//    public ResponseEntity<StudyAppointmentResponseDTO> createStudyMeeting(
//            @PathVariable("studyinfo_id") Long studyInfoId,
//            @RequestBody StudyAppointmentRequestDTO studyAppointmentRequestDTO) {
//
//        // 스터디 회의 등록 정보를 StudyAppointmentRequestDTO로 받아옴
//        StudyAppointment studyAppointment = studyAppointmentRequestDTO.toEntity();
//
//        // 스터디 회의 등록 서비스 호출
//        boolean isCreated = studyService.createStudyAppointment(studyInfoId, studyAppointment);
//
//        // 응답 메시지 설정
//        if (isCreated) {
//            // 스터디 회의가 성공적으로 등록된 경우, 등록된 정보를 응답으로 반환
//            StudyAppointmentResponseDTO responseDTO = new StudyAppointmentResponseDTO(
//                    studyAppointment.getId(),
//                    studyAppointment.getTitle(),
//                    studyAppointment.getMeetingAt(),
//                    studyAppointment.getStartTime(),
//                    studyAppointment.getEndTime()
//            );
//            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
//        } else {
//            // 등록에 실패한 경우 적절한 에러 응답을 처리해도 좋습니다.
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
}

//    // [스터디룸] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 수정
//    // [PUT] [api/study/meeting/{study_info_id}
//    @PutMapping("/study/meeting/{study_info_id}")
//    public ResponseEntity<Map<String, Object>> updateStudyMeeting(
//            @PathVariable("study_info_id") Long studyInfoId,
//            @RequestBody StudyUpdateDTO StudyUpdateDTO) {
//
//        // 요청으로 받아온 데이터를 추출
//        String title = StudyUpdateDTO.getTitle();
//        String description = StudyUpdateDTO.getDescription();
//        LocalDate date = StudyUpdateDTO.getDate();
//        LocalTime startTime = StudyUpdateDTO.getStartTime();
//        LocalTime endTime = StudyUpdateDTO.getEndTime();
//
//        // 스터디 회의 수정 서비스 호출
//        boolean isUpdated = studyService.updateStudyMeeting(studyInfoId, title, description, date, startTime, endTime);
//
//        // 응답 메시지 설정
//        Map<String, Object> response = new HashMap<>();
//        if (isUpdated) {
//            response.put("status", 200);
//            response.put("message", "스터디 회의가 성공적으로 수정되었습니다.");
//        } else {
//            response.put("status", 500);
//            response.put("message", "스터디 회의 수정에 실패했습니다.");
//        }
//
//        // HTTP 응답 반환
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    // [스터디룸] (스터디 장) 일정 보기를 누르면 활성화된 달력 창에서 스터디 회의 삭제
//    // [DELETE] [api/study/{studyinfo_id}/meeting/{study_appointment_id}]
//    @DeleteMapping("/study/{studyinfo_id}/meeting/{study_appointment_id}")
//    public ResponseEntity<Map<String, Object>> deleteStudyMeeting(
//            @PathVariable("studyinfo_id") Long studyInfoId,
//            @PathVariable("study_appointment_id") Long studyAppointmentId) {
//
//        // 스터디 회의 삭제 서비스 호출
//        boolean isDeleted = studyService.deleteStudyMeeting(studyInfoId, studyAppointmentId);
//
//        // 응답 메시지 설정
//        Map<String, Object> response = new HashMap<>();
//        if (isDeleted) {
//            response.put("status", 200);
//            response.put("message", "스터디 회의가 성공적으로 삭제되었습니다.");
//        } else {
//            response.put("status", 400);
//            response.put("message", "스터디 회의 삭제에 실패했습니다.");
//        }
//
//        // HTTP 응답 반환
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
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
//
//    // [스터디룸] 스터디에 소속된 유저 목록
//    // [GET] [api/study/user/list?study={studyinfo_id}]
//    @GetMapping("/study/user/list")
//    public ResponseEntity<Map<String, Object>> getStudyUsers(@RequestParam("study") Long studyInfoId) {
//        List<String> studyUsers = studyService.getStudyUsers(studyInfoId);
//
//        Map<String, Object> response = new HashMap<>();
//
//        if (!studyUsers.isEmpty()) {
//            response.put("status", 200);
//            response.put("study_users", studyUsers);
//        } else {
//            response.put("status", 400);
//            response.put("message", "스터디에 소속된 유저 목록 조회에 실패하였습니다.");
//        }
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    // [스터디룸] 스터디장은 소속된 유저 목록에서 스터디장을 다른사람에게 위임할 수 있다. (자신은 팀원으로 돌아감)
//    // [PUT] [api/study/delegate]
//    @PutMapping("/study/delegate")
//    public ResponseEntity<Map<String, Object>> delegateStudyOwnership(@RequestBody DelegateOwnershipRequestDTO requestDto) {
//
//        // 요청으로 받아온 데이터를 추출
//        String fromNickname = requestDto.getFrom().getNickname();
//        String fromEmail = requestDto.getFrom().getEmail();
//        String toNickname = requestDto.getTo().getNickname();
//        String toEmail = requestDto.getTo().getEmail();
//
//        // 스터디장 위임 서비스 호출
//        boolean isDelegated = studyService.delegateStudyOwnership(fromNickname, fromEmail, toNickname, toEmail);
//
//        // 응답 메시지 설정
//        Map<String, Object> response = new HashMap<>();
//        if (isDelegated) {
//            response.put("status", 200);
//            response.put("message", "스터디장 권한이 성공적으로 위임되었습니다. 자신은 팀원으로 변경되었습니다.");
//        } else {
//            response.put("status", 400);
//            response.put("message", "스터디장 권한 위임에 실패하였습니다.");
//        }
//
//        // HTTP 응답 반환
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//}
