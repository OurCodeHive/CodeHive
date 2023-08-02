package com.spoon.sok.domain.study.dto.requestDTO;

import com.spoon.sok.domain.study.dto.UserInfoDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DelegateOwnershipRequestDTO {
    private UserInfoDTO from;
    private UserInfoDTO to;
}