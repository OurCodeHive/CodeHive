package com.spoon.sok.domain.chat.controller;

import com.spoon.sok.domain.chat.dto.ChatWebSocketDto;
import com.spoon.sok.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getChatList(@PathVariable("id") Long studyInfoId) {
        List<ChatWebSocketDto> result = chatService.getStudyChatList(studyInfoId);
        return new ResponseEntity<List<ChatWebSocketDto>>(result, HttpStatus.OK);
    }

}
