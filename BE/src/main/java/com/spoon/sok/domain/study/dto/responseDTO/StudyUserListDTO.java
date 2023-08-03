package com.spoon.sok.domain.study.dto.responseDTO;

import com.spoon.sok.domain.study.enums.CurrentStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class StudyUserListDTO {
    private Long userId;
    private String nickName;
    private String email;
    private CurrentStatus status;
}
