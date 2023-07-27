package com.spoon.sok.config;

import com.spoon.sok.domain.user.service.CustomOAuth2UserService;
import com.spoon.sok.util.JwtAuthenticationFilter;
import com.spoon.sok.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate redisTemplate;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .httpBasic((httpBasic) -> {
                    httpBasic.disable();
                })
                .csrf(csrf -> csrf.disable())
                .sessionManagement((sessionManagement) -> {
                    sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authorizeHttpRequests((authorizeRequests) -> {
                    authorizeRequests.requestMatchers("/api/login/user", "/login/oauth2/code/google", "/api/reissue", "/",
                                    "/api/signup", "/api/check/**", "/api/email/**", "/api/find/password").permitAll()
                            .anyRequest().authenticated();
                })
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, redisTemplate), UsernamePasswordAuthenticationFilter.class)
                .oauth2Login((oauth2) -> {
                    oauth2.defaultSuccessUrl("/");
                    oauth2.userInfoEndpoint((userInfoEndPoint) -> {
                        userInfoEndPoint.userService(customOAuth2UserService);
                    });
                })
//                .formLogin((formLogin) -> {
//                    formLogin.loginPage("/api/login");
//                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}