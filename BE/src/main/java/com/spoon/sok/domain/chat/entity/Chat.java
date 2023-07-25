package com.spoon.sok.domain.chat.entity;

import com.spoon.sok.domain.chat.dto.ChatDto;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

@Getter
@Document(collection = "chat_item")
@NoArgsConstructor
@ToString
public class Chat {

    @Id
    private String id;
    private Long studyInfoId;
    private Long userId;
    private String message;
    private String time;

    public Chat(ChatDto dto) {
        this.studyInfoId = dto.getStudyRoomId();
        this.userId = dto.getUserId();
        this.message = dto.getMessage();
        this.time = dto.getDateTime();
    }
}
