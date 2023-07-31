package com.spoon.sok.domain.study.dto;

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