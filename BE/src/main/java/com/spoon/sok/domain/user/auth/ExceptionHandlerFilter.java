package com.spoon.sok.domain.user.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spoon.sok.domain.user.dto.response.ExceptionResponseDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (RuntimeException e) {
            log.error("회원가입을 할 수 없습니다.");
            String uri = UriComponentsBuilder.fromUriString("http://localhost:5173/login")
                    .queryParam("status", 406)
                    .build().toUriString();

            response.sendRedirect(uri);
        }
    }
}
