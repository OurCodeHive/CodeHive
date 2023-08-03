package com.java.compile;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/compile")
@RequiredArgsConstructor
public class Controller {

    private final CompileService compileService;

    @PostMapping("")
    public ResponseEntity<?> verifyEmail(@RequestBody RequestDto requestDto) {
        ResponseDto compileResponseDto = compileService.compileAndRun(requestDto);
        return new ResponseEntity<ResponseDto>(compileResponseDto, HttpStatus.OK);
    }

}
