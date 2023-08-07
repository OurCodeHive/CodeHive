package com.spoon.sok.domain.socket.service;


import com.spoon.sok.domain.socket.dto.ChatWebSocketDto;
import com.spoon.sok.domain.socket.entity.Chat;
import com.spoon.sok.domain.socket.repository.ChatRepository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRepository chatRepository;

    @Transactional
    public void mongoInsert(ChatWebSocketDto dto) {
        // 몽고디비 저장
        Chat chat = new Chat(dto);
        chatRepository.save(chat);
    }

    public List<ChatWebSocketDto> getStudyChatList(Long studyInfoId) {

        List<ChatWebSocketDto> result = new ArrayList<>();
        List<Chat> chatList = chatRepository.findByStudyInfoId(studyInfoId);

        for (Chat chat : chatList) {
            ChatWebSocketDto chatItem = new ChatWebSocketDto();
            chatItem.setStudyRoomId(chat.getStudyInfoId());
            chatItem.setUserId(chat.getUserId());
            chatItem.setMessage(chat.getMessage());
            chatItem.setDateTime(chat.getTime());
            result.add(chatItem);
        }
        return result;
    }
}
