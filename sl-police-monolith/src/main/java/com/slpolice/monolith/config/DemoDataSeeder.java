package com.slpolice.monolith.config;

import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.Officer;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.OfficerRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Seeds the demo dataset used by the mobile app walkthrough.
 *
 * Every step is idempotent, so restarting the container against the existing
 * Postgres volume neither duplicates rows nor resets fines that were paid
 * during a demo.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DemoDataSeeder {

    private final FineCategoryRepository fineCategoryRepository;
    private final OfficerRepository officerRepository;
    private final TrafficFineRepository trafficFineRepository;

    @Bean
    public ApplicationRunner seedDemoData() {
        return args -> {
            FineCategory speeding = category("Speeding", "3000.00");
            FineCategory seatbelt = category("No Seatbelt", "1500.00");
            FineCategory redLight = category("Red Light Violation", "2500.00");
            FineCategory mobile = category("Using Mobile While Driving", "2000.00");

            Officer colombo = officer("OB5544", "Colombo", "+94771234567");
            Officer kandy = officer("OB7788", "Kandy", "+94779876543");
            Officer galle = officer("OB1122", "Galle", "+94761112233");
            Officer matara = officer("OB3344", "Matara", "+94764445566");

            pendingFine("DEMO-1001", speeding, colombo, "Galle Road, Colombo 03");
            pendingFine("DEMO-1002", seatbelt, colombo, "Duplication Road, Colombo 04");
            pendingFine("DEMO-1003", redLight, kandy, "Peradeniya Road, Kandy");
            pendingFine("DEMO-1004", mobile, kandy, "Dalada Veediya, Kandy");
            pendingFine("DEMO-1005", speeding, galle, "Matara Road, Galle");
            pendingFine("DEMO-1006", redLight, matara, "Beach Road, Matara");

            paidFine("DEMO-9001", speeding, colombo, "Baseline Road, Colombo 09");

            log.info("Demo data ready: {} categories, {} officers, {} fines",
                    fineCategoryRepository.count(),
                    officerRepository.count(),
                    trafficFineRepository.count());
        };
    }

    private FineCategory category(String name, String amount) {
        return fineCategoryRepository.findAll().stream()
                .filter(existing -> existing.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    log.info("Seeding fine category: {}", name);
                    return fineCategoryRepository.save(FineCategory.builder()
                            .name(name)
                            .amount(new BigDecimal(amount))
                            .build());
                });
    }

    private Officer officer(String badgeNumber, String district, String phoneNumber) {
        return officerRepository.findByBadgeNumber(badgeNumber)
                .orElseGet(() -> {
                    log.info("Seeding officer: {} ({})", badgeNumber, district);
                    return officerRepository.save(Officer.builder()
                            .badgeNumber(badgeNumber)
                            .district(district)
                            .phoneNumber(phoneNumber)
                            .build());
                });
    }

    private void pendingFine(String reference, FineCategory category, Officer officer, String location) {
        seedFine(reference, category, officer, location, "PENDING");
    }

    private void paidFine(String reference, FineCategory category, Officer officer, String location) {
        seedFine(reference, category, officer, location, "PAID");
    }

    private void seedFine(String reference, FineCategory category, Officer officer, String location, String status) {
        if (trafficFineRepository.findByReferenceNumber(reference).isPresent()) {
            return;
        }
        log.info("Seeding {} fine: {}", status, reference);
        trafficFineRepository.save(TrafficFine.builder()
                .referenceNumber(reference)
                .category(category)
                .officer(officer)
                .location(location)
                .status(status)
                .issuedAt(LocalDateTime.now())
                .build());
    }
}
