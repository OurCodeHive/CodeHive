package com.spoon.sok.domain.study.dto.queryDTO;

import java.util.Date;

public interface FixStudyAppointmentDto {

    Long getStudyappointmentId();
    Long getStudyinfoId();

    String getTitle();

    Date getStartTime();

    Date getEndTime();

    Date getMeetingAt();
}