package com.spoon.sok.domain.study.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class StudyNoticeDTO {
    private Long id;
    private String author;
    private String title;
    private String content;
    private LocalDate uploadAt;
}
