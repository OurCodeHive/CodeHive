package com.spoon.sok.domain.study.dto.queryDTO;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Data
@NoArgsConstructor
@Getter
@Setter
public class StudyCreationDto {
    private String email;
    private String usersId;
    private String title;
    private String description;
    private Date startAt;
    private Date endAt;
    private String enterName;
}
