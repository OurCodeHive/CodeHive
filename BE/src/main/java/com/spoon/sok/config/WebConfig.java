package com.spoon.sok.config;

import com.spoon.sok.domain.user.repository.UserRepository;
import com.spoon.sok.util.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final UserRepository userRepository;

    @Autowired
    public WebConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 미인증이어도 사용할 수 있는 요청
    private String[] INTERCEPTOR_WHITE_LIST = {
            "/api/login/user",
            "/api/login/google",
            "/api/find/password",
            "/api/signup",
            "/api/check/**",
            "/api/email/**"
    };

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor(userRepository))
                .excludePathPatterns(INTERCEPTOR_WHITE_LIST);
    }
}