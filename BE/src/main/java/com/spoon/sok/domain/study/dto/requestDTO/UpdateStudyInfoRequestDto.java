package com.spoon.sok.domain.study.dto.requestDTO;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UpdateStudyInfoRequestDto {

    private Long studyInfoId;
    private String title;
    private String description;

    private Date startAt;
    private Date endAt;
    private String profile;

}
