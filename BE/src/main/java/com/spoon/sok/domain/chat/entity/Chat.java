package com.spoon.sok.domain.chat.entity;

import com.spoon.sok.domain.chat.dto.ChatWebSocketDto;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "chat")
@NoArgsConstructor
@ToString
public class Chat {

    @Id
    private String id;
    private Long studyInfoId;
    private Long userId;
    private String message;
    private String time;

    public Chat(ChatWebSocketDto dto) {
        this.studyInfoId = dto.getStudyRoomId();
        this.userId = dto.getUserId();
        this.message = dto.getMessage();
        this.time = dto.getDateTime();
    }
}
