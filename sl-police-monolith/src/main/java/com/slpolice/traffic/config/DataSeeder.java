package com.slpolice.traffic.config;

import com.slpolice.traffic.security.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Bean
    public ApplicationRunner seedData() {
        return args -> {
            if (!userRepo.existsByUsername("admin")) {
                userRepo.save(new User("admin", encoder.encode("admin123"),
                        User.Role.POLICE, "Admin Officer", "admin@slpolice.lk", "0771234567"));
                log.info("Created default admin user: admin / admin123");
            }
            if (!userRepo.existsByUsername("motorist1")) {
                userRepo.save(new User("motorist1", encoder.encode("pass123"),
                        User.Role.MOTORIST, "Test Motorist", "motorist@test.lk", "0779876543"));
                log.info("Created default motorist user: motorist1 / pass123");
            }
        };
    }
}
