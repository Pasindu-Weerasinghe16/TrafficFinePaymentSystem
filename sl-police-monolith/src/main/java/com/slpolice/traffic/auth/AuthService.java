package com.slpolice.traffic.auth;

import com.slpolice.traffic.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        User user = userRepo.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtil.generate(user.getUsername(), user.getRole().name());
        return new LoginResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }

    public LoginResponse register(LoginRequest req) {
        if (userRepo.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");
        User user = new User(req.getUsername(), encoder.encode(req.getPassword()),
                User.Role.MOTORIST, req.getFullName() != null ? req.getFullName() : req.getUsername(),
                req.getEmail(), req.getPhone());
        userRepo.save(user);
        String token = jwtUtil.generate(user.getUsername(), user.getRole().name());
        return new LoginResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }
}
