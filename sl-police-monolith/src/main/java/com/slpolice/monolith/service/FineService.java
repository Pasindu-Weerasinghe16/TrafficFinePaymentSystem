package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.ValidateFineResponse;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FineService {

    private final FineCategoryRepository fineCategoryRepository;
    private final TrafficFineRepository trafficFineRepository;

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
