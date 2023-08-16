package com.spoon.sok.domain.user.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public abstract class OAuth2UserInfo {
    Map<String, Object> attributes;

    public abstract String getOAuth2Id();

    public abstract String getEmail();

    public abstract String getName();
}
