package com.spoon.sok.domain.study.dto.queryDTO;

import java.util.Date;

public interface StudyInfoDetailDto {

    Date getStartAt();

    Date getEndAt();

    String getStudyinfoId();

    String getUsersId();

    String getEnterName();

    String getProfileImage();

    String getTitle();

    String getDescription();
}
