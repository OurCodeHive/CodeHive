package com.spoon.sok.domain.study.dto.requestDTO;

import com.spoon.sok.domain.study.entity.StudyAppointment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class StudyAppointmentRequestDTO {
    private String title;
    private Date date;
    private Date startTime;
    private Date endTime;

    public StudyAppointment toEntity() {
        return StudyAppointment.builder()
                .title(title)
                .meetingAt(date)
                .startTime(startTime)
                .endTime(endTime)
                .build();
    }
}

