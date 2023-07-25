package com.spoon.sok.domain.email.repository;

import com.spoon.sok.domain.email.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {
    Optional<Email> findByEmail(String email);

    Optional<Email> findByAuthCode(String authcode);

    @Query(value = "select e " +
                "from Email e " +
                "order by e.limitTime DESC " +
                "limit 1")
    Optional<Email> findByNewestCode(String email, String code);
}