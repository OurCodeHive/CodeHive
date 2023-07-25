package com.spoon.sok.domain.chat.api;

import com.spoon.sok.domain.chat.dto.ChatDto;
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
    public ResponseEntity<?> getChatList(@PathVariable("id") Long userId) {
        List<ChatDto> result = chatService.getStudyChatList(userId);
        return new ResponseEntity<List<ChatDto>>(result, HttpStatus.OK);
    }

}
