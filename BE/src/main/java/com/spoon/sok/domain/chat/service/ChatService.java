package com.spoon.sok.domain.chat.service;


import com.spoon.sok.domain.chat.dto.ChatDto;
import com.spoon.sok.domain.chat.entity.Chat;
import com.spoon.sok.domain.chat.repository.ChatRepository;
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
    public void mongoInsert(ChatDto dto) {
        // 몽고디비 저장
        Chat chat = new Chat(dto);
        chatRepository.save(chat);
    }

    public List<ChatDto> getStudyChatList(Long userId) {

        List<ChatDto> chatList = new ArrayList<>();

        for (ChatDto chatDto : chatList) {

        }
        return chatList;
    }
}
