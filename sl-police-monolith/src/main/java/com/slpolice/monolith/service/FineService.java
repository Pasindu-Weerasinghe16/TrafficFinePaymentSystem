package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.FineRequest;
import com.slpolice.monolith.dto.FineResponse;
import com.slpolice.monolith.dto.ValidateFineResponse;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FineService {

    private final FineCategoryRepository fineCategoryRepository;
    private final TrafficFineRepository trafficFineRepository;

    // ─── Fine management (admin & motorist portals) ────────────────────────────

    /** All fines, newest first — admin portal fines list. */
    public List<FineResponse> getAllFines() {
        return trafficFineRepository.findAll().stream()
                .sorted((a, b) -> b.getIssuedAt().compareTo(a.getIssuedAt()))
                .map(FineResponse::from)
                .collect(Collectors.toList());
    }

    public FineResponse getFine(Long id) {
        TrafficFine fine = trafficFineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found with ID: " + id));
        return FineResponse.from(fine);
    }

    /** Fines for a vehicle — motorist portal lookup. */
    public List<FineResponse> getFinesForVehicle(String vehicleNumber) {
        return trafficFineRepository.findByVehicleNumberIgnoreCaseOrderByIssuedAtDesc(vehicleNumber).stream()
                .map(FineResponse::from)
                .collect(Collectors.toList());
    }

    /** Issue a new PENDING fine — admin portal. */
    @Transactional
    public FineResponse createFine(FineRequest request) {
        TrafficFine fine = TrafficFine.builder()
                .referenceNumber(newReferenceNumber())
                .vehicleNumber(request.getVehicleNumber() != null ? request.getVehicleNumber().toUpperCase() : null)
                .amount(request.getAmount())
                .location(request.getLocation())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status("PENDING")
                .issuedAt(LocalDateTime.now())
                .build();
        fine = trafficFineRepository.save(fine);
        log.info("Issued fine {} for vehicle {}", fine.getReferenceNumber(), fine.getVehicleNumber());
        return FineResponse.from(fine);
    }

    /** Cancel a PENDING fine — admin portal. */
    @Transactional
    public FineResponse cancelFine(Long id) {
        TrafficFine fine = trafficFineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found with ID: " + id));
        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException("A paid fine cannot be cancelled.");
        }
        fine.setStatus("CANCELLED");
        trafficFineRepository.save(fine);
        return FineResponse.from(fine);
    }

    private String newReferenceNumber() {
        return "TF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // ─── On-the-spot validation (mobile app) ───────────────────────────────────

    public ValidateFineResponse validateFine(String referenceNumber, Long categoryId, String officerBadge) {
        // Step 1: Verify the category exists and get the fine amount
        FineCategory category = fineCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Fine category not found with ID: " + categoryId));

        // Step 2: Check if the referenceNumber is already paid
        Optional<TrafficFine> existingFine = trafficFineRepository.findByReferenceNumber(referenceNumber);
        boolean isAlreadyPaid = existingFine.isPresent() && "PAID".equalsIgnoreCase(existingFine.get().getStatus());

        log.info("Fine validation for reference={}, category={}, alreadyPaid={}", referenceNumber, category.getName(), isAlreadyPaid);

        return ValidateFineResponse.builder()
                .amount(category.getAmount())
                .categoryName(category.getName())
                .isAlreadyPaid(isAlreadyPaid)
                .build();
    }
}
