package com.spoon.sok.domain.user.auth;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(AuthProvider authProvider, Map<String, Object> attributes) {
        switch (authProvider) {
            case GOOGLE:
                return new GoogleOAuth2User(attributes);

            default:
                throw new IllegalArgumentException("Invaild Provider Type");
        }
    }
}
