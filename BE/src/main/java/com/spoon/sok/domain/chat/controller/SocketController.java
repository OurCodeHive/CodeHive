package com.spoon.sok.domain.chat.controller;

import com.spoon.sok.domain.chat.dto.ChatDto;
import com.spoon.sok.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat")
    public void sendMessage(ChatDto chatDto, SimpMessageHeaderAccessor accessor) {
        chatService.mongoInsert(chatDto);
//        System.out.println(chatDto);
        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatDto.getStudyRoomId(), chatDto);
    }

}
