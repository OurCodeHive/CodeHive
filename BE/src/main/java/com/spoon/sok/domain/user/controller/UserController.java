package com.spoon.sok.domain.user.controller;

import com.spoon.sok.domain.user.dto.UserRequestDto;
import com.spoon.sok.domain.user.dto.UserSignupRequestDto;
import com.spoon.sok.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/login/user")
    public ResponseEntity<?> login(@RequestBody UserRequestDto requestDto) {
        return userService.login(requestDto);
    }

//    @PostMapping("/signup")
//    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto requestDto) {
//        return userService.signup(requestDto);
//    }
//
//    @GetMapping("/check/{nickname}")
//    public boolean checkNickname(@PathVariable String nickname) {
//        return userService.checkNickname(nickname);
//    }
//
////    @PostMapping("/find/password")
////    public ResponseEntity<?> changePassword(@RequestBody UserRequestDto requestDto) {
////        return userService.changePassword(requestDto);
////    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout() {
//        return userService.logout();
//    }
//
//    @PutMapping("/info/{nickname}")
//    public ResponseEntity<?> changeUserInfo(@PathVariable String nickname) {
//        return userService.changeUserInfo();
//    }
//
//    @PostMapping("resign")
//    public ResponseEntity<?> deleteAccount() {
//        return userService.deleteAccount();
//    }
//
//    @PostMapping("resign/chat")
//    public ResponseEntity<?> deleteChat() {
//        return userService.deleteChat();
//    }
//
//    @PostMapping("resign/file")
//    public ResponseEntity<?> deleteFiles() {
//        return userService.deleteFiles();
//    }
}
