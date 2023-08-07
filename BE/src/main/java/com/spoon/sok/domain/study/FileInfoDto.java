package com.spoon.sok.domain.study;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FileInfoDto {

    private Long size;
    private String originName;
    private String uniqueName;
    private String url;
    private String extension;

}
