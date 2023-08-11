package com.spoon.sok.domain.study.dto.queryDTO;

import java.util.Date;

public interface StudyAppointmentDTO {

    Long getStudyinfoId();

    String getTitle();

    Date getStartTime();

    Date getEndTime();

    Date getMeetingAt();
}
