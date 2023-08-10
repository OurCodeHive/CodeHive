package com.spoon.sok.domain.study.dto.queryDTO;

import com.spoon.sok.domain.study.enums.CurrentStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeUserStudyDto {
    private Long usersId;
    private Long userstudyId;
    private int status;

    public String convertCurrentStatus() {
        if (CurrentStatus.values()[this.status].equals(CurrentStatus.ACCEPT)) return CurrentStatus.ACCEPT.toString();
        if (CurrentStatus.values()[this.status].equals(CurrentStatus.REJECT)) return CurrentStatus.REJECT.toString();
        return CurrentStatus.WAIT.toString();
    }
}
