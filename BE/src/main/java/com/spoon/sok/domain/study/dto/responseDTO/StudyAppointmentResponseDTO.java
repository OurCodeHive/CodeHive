package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class StudyAppointmentResponseDTO {
    private Long id;
    private String title;
    private Date meetingAt;
    private Date startTime;
    private Date endTime;

    @Builder
    public StudyAppointmentResponseDTO(Long id, String title, Date meetingAt, Date startTime, Date endTime) {
        this.id = id;
        this.title = title;
        this.meetingAt = meetingAt;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
