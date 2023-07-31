package com.spoon.sok.domain.study.dto.queryDTO;

import java.util.Date;

public interface StudyInfoDetailDto {

    Date getCreatedAt();

    Date getEndAt();
    String getStudyinfoId();

    String getUsersId();

    String getEnterName();

    String getProfileImage();

    String getTitle();

    String getDescription();
}
