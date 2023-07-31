package com.spoon.sok.domain.study.dto;

import java.util.Date;

public interface StudyAppointmentDTO {
    Long getStudyappointmentId();

    Long getStudyinfoId();

    String getTitle();

    String getDay();

    String getStartTime();

    String getEndTime();

    String getDate();
}
