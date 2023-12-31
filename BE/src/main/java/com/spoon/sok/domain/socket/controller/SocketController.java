package com.spoon.sok.domain.socket.controller;

import com.spoon.sok.domain.socket.service.CodeExecuteService;
import com.spoon.sok.domain.socket.dto.*;
import com.spoon.sok.domain.socket.service.ChatService;
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
    private final CodeExecuteService codeExecuteService;

    @MessageMapping("/chat")
    public void sendMessage(ChatWebSocketDto chatDto, SimpMessageHeaderAccessor accessor) {
        chatService.mongoInsert(chatDto);
        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatDto.getStudyRoomId(), chatDto);
    }

    @MessageMapping("/notice")
    public void sendNotice(NoticeWebSocketDto noticeDto, SimpMessageHeaderAccessor accessor) {
        simpMessagingTemplate.convertAndSend("/sub/notice/" + noticeDto.getStudyRoomId(), noticeDto);
    }

    @MessageMapping("/submit")
    public void submitNotice(SubmitWebSocketDto compileRequestDto, SimpMessageHeaderAccessor accessor) {
        simpMessagingTemplate.convertAndSend("/sub/submit/" + compileRequestDto.getStudyRoomId(), compileRequestDto);
    }

    @MessageMapping("/run")
    public void runCode(RunCodeRequestDto runCodeRequestDto, SimpMessageHeaderAccessor accessor) {
        String response = codeExecuteService.RunCode(runCodeRequestDto);
        simpMessagingTemplate.convertAndSend("/sub/run/" + runCodeRequestDto.getStudyRoomId(), response);
    }

    @MessageMapping("/cursor")
    public void cursor(CursorWebSocketDto cursorWebSocketDto, SimpMessageHeaderAccessor accessor) {
        simpMessagingTemplate.convertAndSend("/sub/cursor/" + cursorWebSocketDto.getStudyRoomId(), cursorWebSocketDto);
    }
}
