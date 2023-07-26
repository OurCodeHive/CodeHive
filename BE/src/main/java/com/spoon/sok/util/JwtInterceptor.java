package com.spoon.sok.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class JwtInterceptor implements HandlerInterceptor {

    private String secretKey = "SSAFY_DAEJEON_SOK_PROJECT";

    private final UserRepository userRepository;

    @Autowired
    public JwtInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        String url = request.getRequestURI();
//        if (url.contains("swagger") || url.contains("api-docs") || url.contains("webjars")) {
//            return true;
//        }
//        log.info("프리핸들: {}", request.getHeader("Authorization"));
//        log.info("키 : {}", secretKey);
//
//        try {
//            JwtTokenUtil.isExpired(request.getHeader("Authorization"), secretKey);
//        } catch (ExpiredJwtException e) {
//
//            Map<String, Object> responseBody = new HashMap<>();
//            responseBody.put("status", HttpServletResponse.SC_UNAUTHORIZED);
//            responseBody.put("message", "Again User Login");
//
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
//            return false;
//        }
//
//        String email = JwtTokenUtil.getEmail(request.getHeader("Authorization"), secretKey);
//        if (userRepository.findByEmail(email) != null) {
//            log.info("email prehandle : {}", email);
//            log.info("token 검사 완료");
//        }
//        return true;
//    }
}
