package com.spoon.sok.domain.user.service;

import com.spoon.sok.domain.email.entity.Email;
import com.spoon.sok.domain.email.repository.EmailRepository;
import com.spoon.sok.domain.user.auth.AuthProvider;
import com.spoon.sok.domain.user.dto.request.*;
import com.spoon.sok.domain.user.dto.response.GetUserInfoResponseDto;
import com.spoon.sok.domain.user.dto.response.UserResponseDto;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.enums.Authority;
import com.spoon.sok.domain.user.enums.UserStatus;
import com.spoon.sok.domain.user.repository.UserRepository;
import com.spoon.sok.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate redisTemplate;

    private final UserRepository userRepository;
    private final EmailRepository emailRepository;

    public UserResponseDto login(UserLoginRequestDto requestDto) {
        if (!requestDto.getEmail().contains("@")) {
            return UserResponseDto.builder().responseCode(1).build();
        }

        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());

        if (user.isEmpty()) {
            return UserResponseDto.builder().responseCode(2).build();
        }

        if (!passwordEncoder.matches(requestDto.getPassword(), user.get().getPassword())) {
            return UserResponseDto.builder().responseCode(3).build();
        }

        if (user.get().getStatus() == UserStatus.LEAVE || user.get().getStatus() == UserStatus.FORCELEAVE) {
            return UserResponseDto.builder().responseCode(4).build();
        }

        UsernamePasswordAuthenticationToken authenticationToken = requestDto.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        redisTemplate.opsForValue()
                .set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

        return UserResponseDto.builder()
                .tokenInfo(tokenInfo)
                .userId(user.get().getId())
                .nickname(user.get().getNickname())
                .responseCode(0)
                .build();
    }

    public UserResponseDto reissue(UserReissueRequestDto requestDto, String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            return UserResponseDto.builder().responseCode(1).build();
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(requestDto.getAccessToken());

        String restRefreshToken = (String) redisTemplate.opsForValue().get("RT:" + authentication.getName());
        if (ObjectUtils.isEmpty(restRefreshToken)) {
            return UserResponseDto.builder().responseCode(2).build();
        }

        if (!restRefreshToken.equals(refreshToken)) {
            return UserResponseDto.builder().responseCode(3).build();
        }

        UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

        redisTemplate.opsForValue()
                .set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

        return UserResponseDto.builder()
                .tokenInfo(tokenInfo)
                .responseCode(0)
                .build();
    }

    @Transactional
    public int signup(UserSignupRequestDto requestDto) {
        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());

        if (!user.isEmpty()) {
            return 1;
        }

        user = userRepository.findByNickname(requestDto.getNickname());

        if (!user.isEmpty()) {
            return 2;
        }

        Optional<Email> email = emailRepository.findByNewestCode(requestDto.getEmail());

        if (email.isEmpty() || email.get().getIsauth() != 1 || !email.get().getAuthCode().equals(requestDto.getAuthCode())) {
            return 3;
        }

        User signinUser = User.builder()
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .nickname(requestDto.getNickname())
                .status(UserStatus.NORMAL)
                .authProvider(AuthProvider.ORIGIN)
                .createdAt(LocalDateTime.now())
                .roles(Collections.singletonList(Authority.ROLE_USER.name()))
                .build();

        userRepository.save(signinUser);

        return 0;
    }

    public boolean checkNickname(String nickname) {
        Optional<User> checkUser = userRepository.findByNickname(nickname);

        if (checkUser.isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public int changePassword(UserChangePasswordRequestDto requestDto) {
        Optional<User> user = userRepository.findByEmail(requestDto.getEmail());

        if (user.get().getAuthProvider() == null) {
            return 1;
        }

        Optional<Email> email = emailRepository.findByNewestCode(requestDto.getEmail());

        if (email.isEmpty() || email.get().getIsauth() != 1) {
            return 2;
        }

        user.get().updatePassword(passwordEncoder.encode(requestDto.getNewPassword()));

        return 0;
    }

    public boolean logout(UserLogoutRequestDto requestDto) {
        if (!jwtTokenProvider.validateToken(requestDto.getAccessToken())) {
            return false;
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(requestDto.getAccessToken());

        if (redisTemplate.opsForValue().get("RT:" + authentication.getName()) != null) {
            redisTemplate.delete("RT:" + authentication.getName());
        }

        Long expiration = jwtTokenProvider.getExpiration(requestDto.getAccessToken());
        redisTemplate.opsForValue()
                .set(requestDto.getAccessToken(), "logout", expiration, TimeUnit.MILLISECONDS);

        return true;
    }

    @Transactional
    public boolean resign(UserResignRequestDto requestDto) {
        Optional<User> user = userRepository.findById(requestDto.getUserId());

        if (user.isEmpty()) {
            return false;
        }

        user.get().updateUserStatus(UserStatus.LEAVE);

        return true;
    }

    public GetUserInfoResponseDto getUserInfo(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return null;
        }

        GetUserInfoResponseDto responseDto = GetUserInfoResponseDto.builder()
                .email(user.get().getEmail())
                .nickname(user.get().getNickname())
                .build();

        return responseDto;
    }

    @Transactional
    public boolean updateUser(UserUpdateInfoRequestDto requestDto) {
        Optional<User> user = userRepository.findById(requestDto.getUserId());

        if (user.isEmpty()) {
            return false;
        }

        user.get().updateUserInfo(requestDto.getEmail(), passwordEncoder.encode(requestDto.getPassword()), requestDto.getNickname());

        return true;
    }

    @Transactional
    public boolean resignbyHost(UserResignRequestDto requestDto) {
        Optional<User> user = userRepository.findById(requestDto.getUserId());

        if (user.isEmpty()) {
            return false;
        }

        userRepository.deleteById(user.get().getId());

        return true;
    }
}
