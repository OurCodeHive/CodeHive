package com.spoon.sok.domain.comedy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "CODING_LITERATURE")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CodingLiterature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coding_literature_id")
    private Long id;

    @Column(name = "content")
    private String content;


    @Column(name = "writer")
    private String writer;
}
