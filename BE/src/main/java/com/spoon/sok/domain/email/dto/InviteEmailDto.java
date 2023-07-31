package com.spoon.sok.domain.email.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class InviteEmailDto {
    private Long studyinfo_id;
    private List<String> email;
}
