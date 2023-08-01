package com.spoon.sok.domain.chat.controller;

import com.spoon.sok.CodeExecuteService;
import com.spoon.sok.domain.chat.dto.*;
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
    private final CodeExecuteService codeExecuteService;

    @MessageMapping("/chat")
    public void sendMessage(ChatDto chatDto, SimpMessageHeaderAccessor accessor) {
        chatService.mongoInsert(chatDto);
        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatDto.getStudyRoomId(), chatDto);
    }

    @MessageMapping("/notice")
    public void sendNotice(NoticeDto noticeDto, SimpMessageHeaderAccessor accessor) {
        simpMessagingTemplate.convertAndSend("/sub/notice/" + noticeDto.getStudyRoomId(), noticeDto);
    }

    @MessageMapping("/submit")
    public void submitNotice(SubmitRequestDto compileRequestDto, SimpMessageHeaderAccessor accessor) {
        SubmitResponseDto responseDto = new SubmitResponseDto();
        responseDto.setUserId(compileRequestDto.getUserId());
        responseDto.setStudyRoomId(compileRequestDto.getStudyRoomId());
        simpMessagingTemplate.convertAndSend("/sub/submit/" + responseDto.getStudyRoomId(), responseDto);
    }

    @MessageMapping("/run")
    public void runCode(RunCodeRequestDto runCodeRequestDto, SimpMessageHeaderAccessor accessor) {
        String responseDto = codeExecuteService.RunCode(runCodeRequestDto);
        simpMessagingTemplate.convertAndSend("/sub/run/" + runCodeRequestDto.getStudyRoomId(), responseDto);
    }

}
