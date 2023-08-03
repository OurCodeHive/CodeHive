package com.spoon.sok;

import com.spoon.sok.domain.chat.dto.CodeAPIRequestDto;
import com.spoon.sok.domain.chat.dto.RunCodeRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
public class CodeExecuteService {

    @Value("${AWS_API_GATEWAY_URL}")
    private String AWS_API_GATEWAY_URL;

    @Value("${JAVA_COMPILE_SERVER}")
    private String JAVA_COMPILE_SERVER;

    public String RunCode(RunCodeRequestDto runCodeRequestDto){
        String code = runCodeRequestDto.getCode();
        String input = runCodeRequestDto.getInput();
        String name = UUID.randomUUID().toString();
        Long userId = runCodeRequestDto.getUserId();

        // AWS API gateway Poat 요청
        CodeAPIRequestDto codeAPIRequestDto = new CodeAPIRequestDto();

        codeAPIRequestDto.setCode(code);
        codeAPIRequestDto.setName(name);
        codeAPIRequestDto.setInput(input);
        codeAPIRequestDto.setUserId(userId);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<CodeAPIRequestDto> requestEntity = new HttpEntity<>(codeAPIRequestDto);

        if (runCodeRequestDto.getLanguage().equals("Python")) {
            return restTemplate.exchange(AWS_API_GATEWAY_URL, HttpMethod.POST, requestEntity, String.class).getBody();
        } else {
            return restTemplate.exchange(JAVA_COMPILE_SERVER, HttpMethod.POST, requestEntity, String.class).getBody();
        }
    }
}