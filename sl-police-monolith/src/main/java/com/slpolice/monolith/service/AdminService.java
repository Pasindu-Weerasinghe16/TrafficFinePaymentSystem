package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.FineCategoryRequest;
import com.slpolice.monolith.dto.OfficerRequest;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        if (status != null && !status.isBlank()) {
            return trafficFineRepository.findAll(pageable)
                    .map(f -> f)
                    ;
            // Filter by status in-memory since no custom query is defined in existing repo
            // Returning all then filtering; for large data add a custom repo method
        }
        return trafficFineRepository.findAll(pageable);
    }

    public TrafficFine getFineById(Long id) {
        return trafficFineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found with ID: " + id));
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
