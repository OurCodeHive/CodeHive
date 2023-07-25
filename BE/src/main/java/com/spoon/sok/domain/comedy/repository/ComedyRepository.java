package com.spoon.sok.domain.comedy.repository;

import com.spoon.sok.domain.comedy.entity.CodingLiterature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComedyRepository extends JpaRepository<CodingLiterature, Long> {

    Optional<CodingLiterature> findById(Long comedyId);
}
