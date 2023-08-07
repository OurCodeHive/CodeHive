package com.spoon.sok.domain.socket.controller;

import com.spoon.sok.domain.socket.dto.ChatWebSocketDto;
import com.spoon.sok.domain.socket.repository.ChatRepository;
import com.spoon.sok.domain.socket.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatListController {

    private final ChatService chatService;
    private final ChatRepository chatRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getChatList(@PathVariable("id") Long studyInfoId) {
        List<ChatWebSocketDto> result = chatService.getStudyChatList(studyInfoId);
        return new ResponseEntity<List<ChatWebSocketDto>>(result, HttpStatus.OK);
    }

    // 삭제 테스트 컨트롤러 실제쓰이는건 아님
    @DeleteMapping("/{id}")
    public void deleteChat(@PathVariable("id") Long userId) {
        chatRepository.deleteAllByUserId(userId);
    }
}
