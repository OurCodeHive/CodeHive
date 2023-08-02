package com.spoon.sok.domain.user.controller;

import com.spoon.sok.domain.user.dto.request.*;
import com.spoon.sok.domain.user.dto.response.GetUserInfoResponseDto;
import com.spoon.sok.domain.user.dto.response.UserResponseDto;
import com.spoon.sok.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private Map<String, Object> result;

    @PostMapping("/login/user")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto requestDto, HttpServletResponse response) {
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
                case 4:
                    result.put("status", 400);
                    result.put("message", "탈퇴된 회원입니다.");

                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
            }
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", responseDto.getTokenInfo().getRefreshToken())
//                .domain("localhost")
                .path("/")
                .sameSite("None")
                .httpOnly(true)
                .secure(true)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        result.put("status", 200);
        result.put("message", "로그인 성공");
        result.put("userId", responseDto.getUserId());
        result.put("nickname", responseDto.getNickname());
        result.put("accessToken", responseDto.getTokenInfo().getAccessToken());

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

        if (!userService.checkNickname(nickname)) {
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

    @PostMapping("/info/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        result = new HashMap<>();

        GetUserInfoResponseDto responseDto = userService.getUserInfo(userId);

        if (responseDto == null) {
            result.put("status", 400);
            result.put("message", "회원을 불러오는데 실패하였습니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }

        result.put("email", responseDto.getEmail());
        result.put("nickname", responseDto.getNickname());
        result.put("status", 200);

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @PutMapping("/info/update")
    public ResponseEntity<?> updateUserInfo(@RequestBody UserUpdateInfoRequestDto requestDto) {
        result = new HashMap<>();

        if (userService.updateUser(requestDto)) {
            result.put("status", 400);
            result.put("message", "해당 유저를 찾을 수 없습니다");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }
        result.put("status", 200);
        result.put("message", "회원 정보가 수정되었습니다.");

        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    @PostMapping("/resign/host")
    public ResponseEntity<?> resignbyHost(@RequestBody UserResignRequestDto requestDto) {
        result = new HashMap<>();

        boolean responseCode = userService.resignbyHost(requestDto);

        if (responseCode) {
            result.put("status", 200);
            result.put("message", "회원 삭제 완료");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
        } else {
            result.put("status", 400);
            result.put("message", "잘못된 요청입니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/resign")
    public ResponseEntity<?> resign(@RequestBody UserResignRequestDto requestDto) {
        boolean responseCode = userService.resign(requestDto);

        if (responseCode) {
            result.put("status", 200);
            result.put("message", "회원 탈퇴가 완료되었습니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
        } else {
            result.put("status", 400);
            result.put("message", "잘못된 요청입니다.");

            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
        }
    }
}