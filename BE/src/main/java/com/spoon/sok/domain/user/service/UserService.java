package com.spoon.sok.domain.user.service;

import com.spoon.sok.domain.email.entity.Email;
import com.spoon.sok.domain.email.repository.EmailRepository;
import com.spoon.sok.domain.user.dto.UserRequestDto;
import com.spoon.sok.domain.user.dto.UserSignupRequestDto;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.enums.UserStatus;
import com.spoon.sok.domain.user.repository.UserRepository;
import com.spoon.sok.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserService {

//    @Value("${jwt.secret}")
//    private String secretKey;
//
//    @Value(("${jwt.token-validity-in-seconds}"))
//    private long expireTimeMs;

    private final UserRepository userRepository;
    private final EmailRepository emailRepository;

    public ResponseEntity<?> login(UserRequestDto requestDto) {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());
//        String jwtToken = JwtTokenUtil.createToken(user.get().getEmail(), secretKey, expireTimeMs);

        if (user.isEmpty()) {
            result.put("status", 400);
            result.put("message", "존재하지 않는 사용자입니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        if (!user.get().getPassword().equals(requestDto.getPassword())) {
            result.put("status", 400);
            result.put("message", "비밀번호가 일치하지 않습니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

//        result.put("access_token", jwtToken);
        status = HttpStatus.OK;

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

    @Transactional
    public ResponseEntity<?> signup(UserSignupRequestDto requestDto) {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());

        if (!user.isEmpty()) {
            result.put("status", 400);
            result.put("message", "이미 등록된 사용자입니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        user = userRepository.findByNickname(requestDto.getNickname());

        if (!user.isEmpty()) {
            result.put("status", 400);
            result.put("message", "이미 사용 중인 닉네임 입니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        Optional<Email> email = emailRepository.findByAuthCode(requestDto.getAuthCode());

        if (email.isEmpty()) {
            result.put("status", 400);
            result.put("message", "이메일 인증 코드를 확인할 수 없습니다.");
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(result, status);
        }

        User signinUser = User.builder()
                .requestDto(requestDto)
                .socialLogin(0)
                .status(UserStatus.NORMAL)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(signinUser);

        result.put("status", 200);
        result.put("message", "회원가입 성공");
        status = HttpStatus.BAD_REQUEST;

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

    public boolean checkNickname(String nickname) {
        Optional<User> checkUser = userRepository.findByNickname(nickname);

        if (checkUser.isEmpty()) {
            return true;
        } else {
             return false;
        }
    }
}