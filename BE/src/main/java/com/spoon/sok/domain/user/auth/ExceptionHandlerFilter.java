package com.spoon.sok.domain.user.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spoon.sok.domain.user.dto.response.ExceptionResponseDto;
import com.spoon.sok.domain.user.dto.response.UserResponseDto;
import com.spoon.sok.util.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}") String secretKey;
    @Value("${front_login_url}") String loginUrl;

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            e.printStackTrace();
        } catch (ExpiredJwtException e) {
            String accessToken = request.getHeader("Authorization").substring(7);
            String refreshToken = null;
            Cookie[] cookies = request.getCookies();

            if (cookies != null) {
                for (Cookie c : cookies) {
                    if (c.getName().equals("refreshToken")) {
                        refreshToken = c.getValue();
                    }
                }
            }

            if (!jwtTokenProvider.validateToken(refreshToken)) {
                response.sendRedirect(loginUrl);
            }

            Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);

            String restRefreshToken = (String) redisTemplate.opsForValue().get("RT:" + authentication.getName());
            if (ObjectUtils.isEmpty(restRefreshToken) || !restRefreshToken.equals(refreshToken)) {
                log.error("refresh토큰이 만료되었습니다.");
                response.sendRedirect(loginUrl);
            }

            UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

            redisTemplate.opsForValue()
                    .set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

            ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenInfo.getRefreshToken())
                    .path("/")
                    .sameSite("None")
                    .httpOnly(true)
                    .secure(true)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
            response.setContentType("application/json");

            UserResponseDto.TokenInfo responseToken = UserResponseDto.TokenInfo.builder()
                    .grantType(tokenInfo.getGrantType())
                    .accessToken(tokenInfo.getAccessToken())
                    .build();

            String result = new ObjectMapper().writeValueAsString(responseToken);
            response.getWriter().write(result);
        } catch (UnsupportedJwtException e) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Unsupported JWT Token");
        } catch (IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT claims string is empty.");
        } catch (RuntimeException e) {
            log.error("회원가입을 할 수 없습니다.");
            String uri = UriComponentsBuilder.fromUriString("https://ourcodehive.vercel.app/login")
                    .queryParam("status", 406)
                    .build().toUriString();

            response.sendRedirect(uri);
        }
    }
}
