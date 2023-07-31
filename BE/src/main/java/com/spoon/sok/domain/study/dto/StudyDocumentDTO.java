package com.spoon.sok.domain.study.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class StudyDocumentDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDate uploadAt;
    private String documentUrl;
}
