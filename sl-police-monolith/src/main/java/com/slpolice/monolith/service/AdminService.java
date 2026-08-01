package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.FineCategoryRequest;
import com.slpolice.monolith.dto.OfficerRequest;
import com.slpolice.monolith.dto.TrafficFineRequest;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.Officer;
import com.slpolice.monolith.entity.Payment;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.OfficerRepository;
import com.slpolice.monolith.repository.PaymentRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final TrafficFineRepository trafficFineRepository;
    private final PaymentRepository paymentRepository;
    private final OfficerRepository officerRepository;
    private final FineCategoryRepository fineCategoryRepository;

    // ─── Stats ────────────────────────────────────────────────────────────────

    public Map<String, Object> getOverviewStats() {
        List<Payment> allPayments = paymentRepository.findAll();
        long totalFinesPaid = allPayments.size();
        BigDecimal totalCollections = allPayments.stream()
                .map(Payment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingFines = trafficFineRepository.findAll().stream()
                .filter(f -> "PENDING".equalsIgnoreCase(f.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFinesPaid", totalFinesPaid);
        stats.put("totalCollections", totalCollections);
        stats.put("pendingFines", pendingFines);
        return stats;
    }

    public List<Map<String, Object>> getDistrictStats() {
        List<TrafficFine> paidFines = trafficFineRepository.findAll().stream()
                .filter(f -> "PAID".equalsIgnoreCase(f.getStatus()))
                .collect(Collectors.toList());

        Map<String, BigDecimal> districtMap = new HashMap<>();
        for (TrafficFine fine : paidFines) {
            // Legacy rows predate the officer/category NOT NULL constraint and would
            // otherwise take down the whole statistic with an NPE.
            if (fine.getOfficer() == null || fine.getCategory() == null) {
                continue;
            }
            String district = fine.getOfficer().getDistrict();
            BigDecimal amount = fine.getCategory().getAmount();
            districtMap.merge(district, amount, BigDecimal::add);
        }

        return districtMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("district", entry.getKey());
                    row.put("totalCollected", entry.getValue());
                    return row;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCategoryStats() {
        List<TrafficFine> paidFines = trafficFineRepository.findAll().stream()
                .filter(f -> "PAID".equalsIgnoreCase(f.getStatus()))
                .collect(Collectors.toList());

        Map<String, BigDecimal> categoryMap = new HashMap<>();
        for (TrafficFine fine : paidFines) {
            if (fine.getCategory() == null) {
                continue;
            }
            String categoryName = fine.getCategory().getName();
            BigDecimal amount = fine.getCategory().getAmount();
            categoryMap.merge(categoryName, amount, BigDecimal::add);
        }

        return categoryMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("category", entry.getKey());
                    row.put("totalCollected", entry.getValue());
                    return row;
                })
                .collect(Collectors.toList());
    }

    // ─── Fines Management ─────────────────────────────────────────────────────

    public Page<TrafficFine> getAllFines(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size);
        if (status == null || status.isBlank()) {
            return trafficFineRepository.findAll(pageable);
        }

        // No status-aware repository method exists, so filter in memory and page the
        // result by hand. Fine for demo volumes; add a derived query if this grows.
        List<TrafficFine> matching = trafficFineRepository.findAll().stream()
                .filter(f -> status.equalsIgnoreCase(f.getStatus()))
                .collect(Collectors.toList());

        int from = Math.min((int) pageable.getOffset(), matching.size());
        int to = Math.min(from + pageable.getPageSize(), matching.size());
        return new PageImpl<>(matching.subList(from, to), pageable, matching.size());
    }

    public TrafficFine getFineById(Long id) {
        return trafficFineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found with ID: " + id));
    }

    /**
     * Issues a new fine in PENDING state so it can then be settled through the
     * motorist portal or the mobile app.
     */
    public TrafficFine createFine(TrafficFineRequest request) {
        String reference = request.getReferenceNumber() == null ? "" : request.getReferenceNumber().trim();
        if (reference.isEmpty()) {
            throw new IllegalArgumentException("Reference number is required");
        }
        if (request.getLocation() == null || request.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }
        // reference_number is unique, so a duplicate would fail at the database instead
        // of returning a message the portal can display.
        if (trafficFineRepository.findByReferenceNumber(reference).isPresent()) {
            throw new IllegalStateException("A fine with reference number " + reference + " already exists");
        }

        FineCategory category = fineCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Fine category not found with ID: " + request.getCategoryId()));
        Officer officer = officerRepository.findByBadgeNumber(request.getOfficerBadgeNumber())
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with badge: " + request.getOfficerBadgeNumber()));

        TrafficFine fine = TrafficFine.builder()
                .referenceNumber(reference)
                .category(category)
                .officer(officer)
                .location(request.getLocation().trim())
                .status("PENDING")
                .issuedAt(LocalDateTime.now())
                .build();

        log.info("Issued fine {} ({}) by officer {}", reference, category.getName(), officer.getBadgeNumber());
        return trafficFineRepository.save(fine);
    }

    // ─── Officer Management ───────────────────────────────────────────────────

    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    public Officer createOfficer(OfficerRequest request) {
        Officer officer = Officer.builder()
                .badgeNumber(request.getBadgeNumber())
                .phoneNumber(request.getPhoneNumber())
                .district(request.getDistrict())
                .build();
        return officerRepository.save(officer);
    }

    // ─── Category Management ──────────────────────────────────────────────────

    public List<FineCategory> getAllCategories() {
        return fineCategoryRepository.findAll();
    }

    public FineCategory createCategory(FineCategoryRequest request) {
        FineCategory category = FineCategory.builder()
                .name(request.getName())
                .amount(request.getAmount())
                .build();
        return fineCategoryRepository.save(category);
    }
}
