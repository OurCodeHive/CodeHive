package com.spoon.sok.domain.email.repository;

import com.spoon.sok.domain.email.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<Email, Long> {
}
