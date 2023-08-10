package com.spoon.sok.domain.study.dto.queryDTO;

import java.util.Date;

public interface StudyAppointmentDTO {
    Long getStudyappointmentId();

    Long getStudyinfoId();

    String getTitle();

//    Date getDay();

    Date getStartTime();

    Date getEndTime();

//    Date getDate();
}
