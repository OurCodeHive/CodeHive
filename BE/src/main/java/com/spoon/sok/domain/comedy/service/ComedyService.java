package com.spoon.sok.domain.comedy.service;

import com.spoon.sok.domain.comedy.entity.CodingLiterature;
import com.spoon.sok.domain.comedy.repository.ComedyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComedyService {

    private final ComedyRepository comedyRepository;

    public List<CodingLiterature> getComedy() {
        return comedyRepository.findAll();
    }
}
