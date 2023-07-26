package com.spoon.sok.config;

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
//                .authorizeHttpRequests((authorizeRequests) -> {
//                    authorizeRequests.requestMatchers("/api/login/user", "/api/login/google", "/",
//                            "/api/signup", "/api/check/**", "/api/email/**", "/api/find/password").permitAll();
//                    authorizeRequests.requestMatchers("**").hasAuthority("ROLE_USER");
//                })
//                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, redisTemplate), UsernamePasswordAuthenticationFilter.class)
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