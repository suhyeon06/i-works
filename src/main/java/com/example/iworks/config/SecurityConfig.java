package com.example.iworks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity //스프링 시큐리티 필터(SecurityConfig)가 스프링 필터체인에 등록됨.
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig {
    // 스프링 부트 2.7.0 이상부턴 WebSecurityConfigurerAdapter가 deprecated됨.
    // 아예 자체적으로 SecurityFilterChain Bean을 생성하는 방식으로 바뀌었다.

    @Bean
    public BCryptPasswordEncoder encodePwd(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)

                // 특정 URL에 대한 권한 설정.
                .authorizeHttpRequests((authorizeRequests) -> {
                    authorizeRequests.requestMatchers("/user/**").authenticated(); //antMatcher -> requestMatchers로 변경

                    authorizeRequests.requestMatchers("/manager/**")
                            // ROLE_은 붙이면 안 된다. hasAnyRole()을 사용할 때 자동으로 ROLE_이 붙기 때문이다.
                            .hasAnyRole("ADMIN", "MANAGER");

                    authorizeRequests.requestMatchers("/admin/**")
                            // ROLE_은 붙이면 안 된다. hasRole()을 사용할 때 자동으로 ROLE_이 붙기 때문이다.
                            .hasRole("ADMIN");

                    authorizeRequests.anyRequest().permitAll();
                })

                .formLogin((formLogin) -> {
                    /* 권한이 필요한 요청은 해당 url로 리다이렉트 */
                    formLogin.loginPage("/loginForm");

                    formLogin.loginProcessingUrl("/login"); //login 주소가 호출되면 시큐리티가 낚아채서 로그인을 진행함
                    formLogin.defaultSuccessUrl("/"); //login 성공시 이동할 페이지, 만약 이전에 요청한 페이지가 있다면 해당 페이지로 감
                })

                .build();
    }
}
