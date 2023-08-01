package com.spoon.sok.domain.user.service;

import com.spoon.sok.domain.user.auth.UserPrincipal;
import com.spoon.sok.domain.user.auth.OAuth2UserInfo;
import com.spoon.sok.domain.user.auth.OAuth2UserInfoFactory;
import com.spoon.sok.domain.user.entity.User;
import com.spoon.sok.domain.user.auth.AuthProvider;
import com.spoon.sok.domain.user.enums.Authority;
import com.spoon.sok.domain.user.enums.UserStatus;
import com.spoon.sok.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        return processOauth2User(userRequest, oAuth2User);
    }

    private OAuth2User processOauth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        AuthProvider authProvider = AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(authProvider, oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new RuntimeException("Email Not Found From OAuth2 Provider");
        }

        Optional<User> optionalUser = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user = null;

        if (!optionalUser.isEmpty()) {
            if (!optionalUser.get().getAuthProvider().equals(authProvider)) {
                throw new RuntimeException("Email already signed up.");
            }
            user = updateUser(optionalUser.get(), oAuth2UserInfo);
        } else {
            user = registUser(authProvider, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2UserInfo.getAttributes());
    }

    private User registUser(AuthProvider authProvider, OAuth2UserInfo oAuth2UserInfo) {
        User user = User.builder()
                .email(oAuth2UserInfo.getEmail())
                .createdAt(LocalDateTime.now())
                .nickname(oAuth2UserInfo.getName())
                .oauth2Id(oAuth2UserInfo.getOAuth2Id())
                .status(UserStatus.NORMAL)
                .roles(Collections.singletonList(Authority.ROLE_USER.name()))
                .authProvider(authProvider)
                .build();

        return userRepository.save(user);
    }

    private User updateUser(User user, OAuth2UserInfo oAuth2UserInfo) {
        return userRepository.save(user.update(oAuth2UserInfo));
    }
}