package com.spoon.sok;

import com.spoon.sok.domain.chat.dto.LambdaRequestDto;
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

    public String RunCode(RunCodeRequestDto runCodeRequestDto){

        String code = runCodeRequestDto.getCode();
        String input = runCodeRequestDto.getInput();
        String name = UUID.randomUUID().toString();

        // AWS API gateway Poat 요청
        LambdaRequestDto lambdaRequestDto = new LambdaRequestDto();
        lambdaRequestDto.setCode(code);
        lambdaRequestDto.setName(name);
        lambdaRequestDto.setInput(input);

        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<LambdaRequestDto> requestEntity = new HttpEntity<>(lambdaRequestDto);

        return restTemplate.exchange(AWS_API_GATEWAY_URL, HttpMethod.POST, requestEntity, String.class).getBody();

    }
}