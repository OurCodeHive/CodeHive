package com.spoon.sok.domain.study.dto.responseDTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StudyDocumentDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private Date uploadAt;
    private List<String> documentUrl;
}
