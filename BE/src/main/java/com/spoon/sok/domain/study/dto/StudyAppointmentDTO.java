package com.spoon.sok.domain.study.dto;

import java.util.Date;

public interface StudyAppointmentDTO {
    Long getStudyappointmentId();

    Long getStudyinfoId();

    String getTitle();

    Date getMeetingAt();

    Date getCreatedAt();

    Date getEndAt();

}
