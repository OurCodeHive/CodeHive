package com.spoon.sok.domain.study.dto.queryDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

@Getter
@NoArgsConstructor
public class FixResponseStudyAppointmentDTO {
    private Long studyappointmentId;
    private Long studyinfoId;
    private String title;
    private String meetingAt; // String 형식으로 변경
    private String startTime; // String 형식으로 변경
    private String endTime; // String 형식으로 변경

    @Builder
    public FixResponseStudyAppointmentDTO(Long studyappointmentId, Long studyinfoId, String title, Date meetingAt, Date startTime, Date endTime) {
        this.studyappointmentId = studyappointmentId;
        this.studyinfoId = studyinfoId;
        this.title = title;

        // Date 객체를 서버 시간대의 문자열로 변환
        TimeZone timeZone = TimeZone.getTimeZone("Asia/Seoul");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        dateFormat.setTimeZone(timeZone);

        this.meetingAt = dateFormat.format(meetingAt);
        this.startTime = dateFormat.format(startTime);
        this.endTime = dateFormat.format(endTime);
    }
}
