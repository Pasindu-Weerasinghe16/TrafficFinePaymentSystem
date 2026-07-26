package com.slpolice.monolith.config;

import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.Officer;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.entity.User;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.OfficerRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import com.slpolice.monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Seeds baseline data on startup so the platform is usable out of the box:
 * default login accounts, a set of fine categories, and a couple of officers.
 * Every insert is guarded so the runner is idempotent across restarts.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final OfficerRepository officerRepository;
    private final TrafficFineRepository trafficFineRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner seedData() {
        return args -> {
            seedUsers();
            seedCategories();
            seedOfficers();
            seedFines();
        };
    }

    private void seedUsers() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("POLICE")
                    .build());
            log.info("Seeded default admin user: admin / admin123");
        }
        if (userRepository.findByUsername("motorist1").isEmpty()) {
            userRepository.save(User.builder()
                    .username("motorist1")
                    .passwordHash(passwordEncoder.encode("pass123"))
                    .role("MOTORIST")
                    .build());
            log.info("Seeded default motorist user: motorist1 / pass123");
        }
    }

    private void seedCategories() {
        if (fineCategoryRepository.count() > 0) {
            return;
        }
        fineCategoryRepository.save(FineCategory.builder().name("Speeding").amount(new BigDecimal("3000")).build());
        fineCategoryRepository.save(FineCategory.builder().name("No Seatbelt").amount(new BigDecimal("1500")).build());
        fineCategoryRepository.save(FineCategory.builder().name("Red Light Violation").amount(new BigDecimal("2500")).build());
        fineCategoryRepository.save(FineCategory.builder().name("Using Mobile While Driving").amount(new BigDecimal("2000")).build());
        log.info("Seeded default fine categories");
    }

    private void seedOfficers() {
        if (officerRepository.findByBadgeNumber("OB5544").isEmpty()) {
            officerRepository.save(Officer.builder()
                    .badgeNumber("OB5544")
                    .phoneNumber("+94771234567")
                    .district("Colombo")
                    .build());
        }
        if (officerRepository.findByBadgeNumber("OB7788").isEmpty()) {
            officerRepository.save(Officer.builder()
                    .badgeNumber("OB7788")
                    .phoneNumber("+94779876543")
                    .district("Kandy")
                    .build());
        }
        log.info("Seeded default officers");
    }

    private void seedFines() {
        if (trafficFineRepository.count() > 0) {
            return;
        }
        trafficFineRepository.save(TrafficFine.builder()
                .referenceNumber("TF-DEMO0001")
                .vehicleNumber("CAB1234")
                .amount(new BigDecimal("3000"))
                .location("Galle Road, Colombo 03")
                .description("Exceeding speed limit (72 km/h in a 50 zone)")
                .dueDate("2026-08-15")
                .status("PENDING")
                .issuedAt(LocalDateTime.now().minusDays(2))
                .build());
        trafficFineRepository.save(TrafficFine.builder()
                .referenceNumber("TF-DEMO0002")
                .vehicleNumber("CAB1234")
                .amount(new BigDecimal("1500"))
                .location("Marine Drive, Colombo 06")
                .description("Driver not wearing a seatbelt")
                .dueDate("2026-08-20")
                .status("PENDING")
                .issuedAt(LocalDateTime.now().minusDays(1))
                .build());
        trafficFineRepository.save(TrafficFine.builder()
                .referenceNumber("TF-DEMO0003")
                .vehicleNumber("KL7890")
                .amount(new BigDecimal("2500"))
                .location("Kandy Road, Kadawatha")
                .description("Running a red light")
                .dueDate("2026-08-10")
                .status("PENDING")
                .issuedAt(LocalDateTime.now().minusDays(3))
                .build());
        log.info("Seeded demo traffic fines (vehicles CAB1234, KL7890)");
    }
}
