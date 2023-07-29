package com.spoon.sok.domain.user.service;


import com.spoon.sok.domain.user.auth.OAuthAttributes;
import com.spoon.sok.domain.user.dto.request.UserLoginRequestDto;
import com.spoon.sok.domain.user.dto.response.UserResponseDto;
import com.spoon.sok.domain.user.entity.CustomUserDetails;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.enums.Authority;
import com.spoon.sok.domain.user.enums.UserStatus;
import com.spoon.sok.domain.user.repository.UserRepository;

import com.spoon.sok.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final RedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        System.out.println(attributes);

        User user = saveOrUpdate(attributes);

        return new DefaultOAuth2User(user.getAuthorities(),
                attributes.getAttributes(), attributes.getNameAttributeKey());
    }

    public ResponseEntity<Map<String, Object>> getResponseEntity(Map<String, Object> result) {
        return new ResponseEntity<>(result, HttpStatus.valueOf((int) result.get("status")));
    }

    private User saveOrUpdate(OAuthAttributes attributes) {
        Map<String, Object> result = new HashMap<>();

        Optional<User> optionalUser = userRepository.findByEmail(attributes.getEmail());
        User user = null;

        if (optionalUser.isEmpty()) {
            user = User.builder()
                    .email(attributes.getEmail())
                    .nickname(attributes.getNameAttributeKey())
                    .socialLogin(1)
                    .status(UserStatus.NORMAL)
                    .createdAt(LocalDateTime.now())
                    .roles(Collections.singletonList(Authority.ROLE_USER.name()))
                    .build();

            userRepository.save(user);
        } else if (optionalUser.get().getSocialLogin() == 0) {
            result.put("status", 400);
            result.put("message", "이미 등록된 유저입니다.");

            getResponseEntity(result);

            return null;
        } else {
            user = optionalUser.get();
        }
        UserLoginRequestDto requestDto = UserLoginRequestDto.builder()
                .email(user.getEmail())
                .build();

        UsernamePasswordAuthenticationToken authenticationToken = requestDto.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        redisTemplate.opsForValue()
                .set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

        result.put("status", 200);
        result.put("message", "로그인 성공");
        result.put("userId", user.getId());
        result.put("nickname", user.getNickname());
        result.put("accessToken", tokenInfo.getAccessToken());
        result.put("refreshToken", tokenInfo.getRefreshToken());

        getResponseEntity(result);

        return user;
    }


}