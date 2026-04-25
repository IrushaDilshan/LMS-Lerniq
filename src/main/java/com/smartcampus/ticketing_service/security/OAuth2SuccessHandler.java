package com.smartcampus.ticketing_service.security;

import com.smartcampus.ticketing_service.dto.AuthResponse;
import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public OAuth2SuccessHandler(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = String.valueOf(attributes.get("email"));
        String name = String.valueOf(attributes.getOrDefault("name", email));
        String picture = String.valueOf(attributes.getOrDefault("picture", ""));

        User user = authService.upsertGoogleUser(email, name, picture);
        String token = jwtUtil.generateToken(authService.toUserDetails(user));

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        AuthResponse body = new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
        response.getWriter().write(
                "{\"token\":\"" + body.getToken() + "\"," +
                        "\"type\":\"Bearer\"," +
                        "\"email\":\"" + body.getEmail() + "\"," +
                        "\"name\":\"" + body.getName() + "\"," +
                        "\"role\":\"" + body.getRole() + "\"}");
    }
}
