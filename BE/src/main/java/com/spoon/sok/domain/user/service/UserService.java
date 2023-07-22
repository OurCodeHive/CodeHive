package com.spoon.sok.domain.user.service;

import com.spoon.sok.domain.user.dto.UserRequestDto;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import com.spoon.sok.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value(("${jwt.token-validity-in-seconds}"))
    private long expireTimeMs;

    private final UserRepository userRepository;

    public ResponseEntity<?> login(UserRequestDto requestDto) {
        Map<String, Object> result = new HashMap<>();
        HttpStatus status;

        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());
        String jwtToken = JwtTokenUtil.createToken(user.get().getEmail(), secretKey, expireTimeMs);

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

        result.put("access_token", jwtToken);
        status = HttpStatus.OK;

        return new ResponseEntity<Map<String, Object>>(result, status);
    }

//    public ResponseEntity<?> signup(UserSignupRequestDto requestDto) {
//        Map<String, Object> result = new HashMap<>();
//        HttpStatus status;
//
//
//    }
}