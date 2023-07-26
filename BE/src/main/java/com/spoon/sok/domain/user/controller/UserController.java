package com.spoon.sok.domain.user.controller;

import com.spoon.sok.domain.user.dto.request.*;
import com.spoon.sok.domain.user.dto.response.UserResponseDto;
import com.spoon.sok.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private Map<String, Object> result;

    @PostMapping("/login/user")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto requestDto) {
        UserResponseDto responseDto = userService.login(requestDto);

        result = new HashMap<>();

        if (responseDto.getResponseCode() != 0) {
            switch (responseDto.getResponseCode()) {
                case 1:
                    result.put("status", 400);
                    result.put("message", "이메일 형식이 올바르지 않습니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 2:
                    result.put("status", 400);
                    result.put("message", "존재하지 않는 사용자입니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 3:
                    result.put("status", 400);
                    result.put("message", "비밀번호가 일치하지 않습니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
            }
        }

        result.put("status", 200);
        result.put("message", "로그인 성공");
        result.put("userId", responseDto.getUserId());
        result.put("accessToken", responseDto.getTokenInfo().getAccessToken());
        result.put("refreshToken", responseDto.getTokenInfo().getRefreshToken());

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@Validated @RequestBody UserReissueRequestDto requestDto, Errors errors) {
        result = new HashMap<>();

        if (errors.hasErrors()) {
            System.out.println(errors.toString());;
            result.put("status", 400);
            result.put("message", "에러 발생!");
            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }

        UserResponseDto responseDto = userService.reissue(requestDto);

        if (responseDto.getResponseCode() != 0) {
            switch (responseDto.getResponseCode()) {
                case 1:
                    result.put("status", 400);
                    result.put("message", "Refresh Token 정보가 유효하지 않습니다.");
                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 2:
                    result.put("status", 400);
                    result.put("message", "잘못된 요청입니다.");
                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 3:
                    result.put("status", 400);
                    result.put("message", "Refresh Token 정보가 일치하지 않습니다.");
                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
            }
        }
        result.put("status", 200);
        result.put("message", "Token 정보가 갱신되었습니다.");
        result.put("accessToken", responseDto.getTokenInfo().getAccessToken());
        result.put("refreshToken", responseDto.getTokenInfo().getRefreshToken());

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto requestDto) {
        int responseCode = userService.signup(requestDto);

        result = new HashMap<>();

        if (responseCode != 0) {
            switch (responseCode) {
                case 1:
                    result.put("status", 400);
                    result.put("message", "이미 등록된 사용자입니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 2:
                    result.put("status", 400);
                    result.put("message", "이미 사용 중인 닉네임 입니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 3:
                    result.put("status", 400);
                    result.put("message", "이메일 인증 여부를 확인할 수 없습니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
            }
        }

        result.put("status", 200);
        result.put("message", "회원가입 성공");

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @GetMapping("/check/{nickname}")
    public ResponseEntity<?> checkNickname(@PathVariable String nickname) {
        result = new HashMap<>();

        if (userService.checkNickname(nickname)) {
            result.put("status", 400);
            result.put("message", "이미 사용 중인 닉네임 입니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        } else {
            result.put("status", 200);
            result.put("message", "사용 가능한 닉네임 입니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
        }
    }

    @PostMapping("/find/password")
    public ResponseEntity<?> changePassword(@RequestBody UserChangePasswordRequestDto requestDto) {
        int responseCode = userService.changePassword(requestDto);

        result = new HashMap<>();

        if (responseCode != 0) {
            switch (responseCode) {
                case 1:
                    result.put("status", 400);
                    result.put("message", "소셜 로그인 계정 입니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
                case 2:
                    result.put("status", 400);
                    result.put("message", "이메일 인증 여부를 확인할 수 없습니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
            }

        }

        result.put("status", 200);
        result.put("message", "비밀번호 변경이 완료되었습니다.");

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody UserLogoutRequestDto requestDto) {
        result = new HashMap<>();

        if (!userService.logout(requestDto)) {
            result.put("status", 400);
            result.put("message", "잘못된 요청입니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }

        result.put("status", 200);
        result.put("message", "로그아웃 완료");

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }
}