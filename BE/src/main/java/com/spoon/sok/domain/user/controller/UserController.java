//package com.spoon.sok.domain.user.controller;
//
//import com.spoon.sok.domain.user.dto.UserChangePasswordRequestDto;
//import com.spoon.sok.domain.user.dto.UserRequestDto;
//import com.spoon.sok.domain.user.dto.UserSignupRequestDto;
//import com.spoon.sok.domain.user.service.UserService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Slf4j
//@RestController
//@RequestMapping("/api")
//@RequiredArgsConstructor
//public class UserController {
//    private final UserService userService;
//
//    private Map<String, Object> result;
//
//    @PostMapping("/login/user")
//    public ResponseEntity<?> login(@RequestBody UserRequestDto requestDto) {
//        UserLoginResponseDto responseDto = userService.login(requestDto);
//
//        result = new HashMap<>();
//
//        if (responseDto.getResponseCode() != 0) {
//            switch (responseDto.getResponseCode()) {
//                case 1:
//                    result.put("status", 400);
//                    result.put("message", "존재하지 않는 사용자입니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//                case 2:
//                    result.put("status", 400);
//                    result.put("message", "비밀번호가 일치하지 않습니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//            }
//        }
//
//        result.put("status", 200);
//        result.put("message", "로그인 성공");
//        result.put("accessToken", responseDto.getAccessToken());
//        result.put("refreshToken", responseDto.getRefreshToken());
//
//        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto requestDto) {
//        int responseCode = userService.signup(requestDto);
//
//        if (responseCode != 0) {
//            switch (responseCode) {
//                case 1:
//                    result.put("status", 400);
//                    result.put("message", "이미 등록된 사용자입니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//                case 2:
//                    result.put("status", 400);
//                    result.put("message", "이미 사용 중인 닉네임 입니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//                case 3:
//                    result.put("status", 400);
//                    result.put("message", "이메일 인증 코드를 확인할 수 없습니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//            }
//        }
//
//        result.put("status", 200);
//        result.put("message", "회원가입 성공");
//
//        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
//    }
//
//    @GetMapping("/check/{nickname}")
//    public ResponseEntity<?> checkNickname(@PathVariable String nickname) {
//        if (userService.checkNickname(nickname)) {
//            result.put("status", 400);
//            result.put("message", "이미 사용 중인 닉네임 입니다.");
//
//            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//        } else {
//            result.put("status", 200);
//            result.put("message", "사용 가능한 닉네임 입니다.");
//
//            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
//        }
//    }
//
//    @PostMapping("/find/password")
//    public ResponseEntity<?> changePassword(@RequestBody UserChangePasswordRequestDto requestDto) {
//        int responseCode = userService.changePassword(requestDto);
//
//        if (responseCode != 0) {
//            switch (responseCode) {
//                case 1:
//                    result.put("status", 400);
//                    result.put("message", "소셜 로그인 계정 입니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//                case 2:
//                    result.put("status", 400);
//                    result.put("message", "이메일 인증 코드를 확인할 수 없습니다.");
//
//                    return new ResponseEntity<Map<String, Object>>(result, HttpStatus.BAD_REQUEST);
//            }
//
//        }
//
//        result.put("status", 200);
//        result.put("message", "비밀번호 변경이 완료되었습니다.");
//
//        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
//    }
//
////    @PostMapping("/logout")
////    public ResponseEntity<?> logout() {
////        return userService.logout();
////    }
////
////    @PutMapping("/info/{nickname}")
////    public ResponseEntity<?> changeUserInfo(@PathVariable String nickname) {
////        return userService.changeUserInfo();
////    }
////
////    @PostMapping("resign")
////    public ResponseEntity<?> deleteAccount() {
////        return userService.deleteAccount();
////    }
////
////    @PostMapping("resign/chat")
////    public ResponseEntity<?> deleteChat() {
////        return userService.deleteChat();
////    }
////
////    @PostMapping("resign/file")
////    public ResponseEntity<?> deleteFiles() {
////        return userService.deleteFiles();
////    }
//}