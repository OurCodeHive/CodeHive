package com.spoon.sok.domain.chat.repository;

import com.spoon.sok.domain.chat.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {

    List<Chat> findByStudyInfoId(Long studyInfoId);

}
