package com.slpolice.monolith.controller;

import com.slpolice.monolith.dto.LoginRequest;
import com.slpolice.monolith.dto.LoginResponse;
import com.slpolice.monolith.entity.User;
import com.slpolice.monolith.repository.UserRepository;
import com.slpolice.monolith.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Find user by username
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElse(null);

            if (user == null) {
                log.warn("Login attempt with non-existent username: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"error\": \"Invalid username or password\"}");
            }

            // Validate password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                log.warn("Login attempt with wrong password for user: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"error\": \"Invalid username or password\"}");
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());

            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(user.getRole())
                    .build();

            log.info("User logged in successfully: {}", user.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Error during login", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An error occurred during login\"}");
        }
    }
}
