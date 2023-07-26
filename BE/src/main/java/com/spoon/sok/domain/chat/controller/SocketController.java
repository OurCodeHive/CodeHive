package com.spoon.sok.domain.chat.controller;

import com.spoon.sok.domain.chat.dto.ChatDto;
import com.spoon.sok.domain.chat.dto.CompileRequestDto;
import com.spoon.sok.domain.chat.dto.CompileResponseDto;
import com.spoon.sok.domain.chat.dto.NoticeDto;
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
        System.out.println(chatDto);
        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatDto.getStudyRoomId(), chatDto);
    }

    @MessageMapping("/notice")
    public void sendNotice(NoticeDto noticeDto, SimpMessageHeaderAccessor accessor) {
        System.out.println(noticeDto);
        simpMessagingTemplate.convertAndSend("/sub/notice/" + noticeDto.getStudyRoomId(), noticeDto);
    }

    @MessageMapping("/compile")
    public void getCodeAndInputAndReturnResult(CompileRequestDto compileRequestDto, SimpMessageHeaderAccessor accessor) {
        // System.out.println(compileRequestDto);
        // 여기서 컴파일 하고 결과 받아서 리턴해야하함
        System.out.println("받음");
        System.out.println(compileRequestDto);
        CompileResponseDto responseDto = new CompileResponseDto();
        responseDto.setUserId(compileRequestDto.getUserId());
        responseDto.setStudyRoomId(compileRequestDto.getStudyRoomId());
        responseDto.setResult("구현중 입니다.");
        System.out.println(responseDto);
        simpMessagingTemplate.convertAndSend("/sub/compile/" + responseDto.getStudyRoomId(), responseDto);
    }

}
