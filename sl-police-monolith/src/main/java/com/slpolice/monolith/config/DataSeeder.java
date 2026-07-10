package com.slpolice.monolith.config;

import com.slpolice.monolith.entity.User;
import com.slpolice.monolith.repository.UserRepository;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.repository.FineCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("password123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
        
        if (fineCategoryRepository.count() == 0) {
            FineCategory speeding = new FineCategory();
            speeding.setName("Speeding");
            speeding.setAmount(new BigDecimal("1500"));
            fineCategoryRepository.save(speeding);
            
            FineCategory noBelt = new FineCategory();
            noBelt.setName("No Seatbelt");
            noBelt.setAmount(new BigDecimal("1000"));
            fineCategoryRepository.save(noBelt);
        }
    }
}
