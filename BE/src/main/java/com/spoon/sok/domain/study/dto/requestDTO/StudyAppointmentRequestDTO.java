package com.spoon.sok.domain.study.dto.requestDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spoon.sok.domain.study.entity.StudyAppointment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

//@Getter
//@NoArgsConstructor
//public class StudyAppointmentRequestDTO {
//    private String title;
//    private Date date;
//    private Date startTime;
//    private Date endTime;
//
//    public StudyAppointment toEntity() {
//        return StudyAppointment.builder()
//                .title(title)
//                .meetingAt(date)
//                .startTime(startTime)
//                .endTime(endTime)
//                .build();
//    }
//}

@Getter
@NoArgsConstructor
public class StudyAppointmentRequestDTO {
    private String title;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public StudyAppointment toEntity() {
        LocalDateTime startDateTime = LocalDateTime.of(date, startTime);
        LocalDateTime endDateTime = LocalDateTime.of(date, endTime);

        // LocalDateTime을 Date로 변환
        Date startDate = Date.from(startDateTime.atZone(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant());

        return StudyAppointment.builder()
                .title(title)
                .meetingAt(startDate)
                .startTime(startDate)
                .endTime(endDate)
                .build();
    }
}



