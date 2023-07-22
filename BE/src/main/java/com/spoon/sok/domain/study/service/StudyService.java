package com.spoon.sok.domain.study.service;

import com.spoon.sok.domain.study.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;

}
