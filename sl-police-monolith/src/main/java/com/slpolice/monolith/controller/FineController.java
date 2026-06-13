package com.slpolice.monolith.controller;

import com.slpolice.monolith.dto.ValidateFineResponse;
import com.slpolice.monolith.service.FineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    /**
     * GET /api/fines/validate?referenceNumber=...&categoryId=...&officerBadge=...
     * Validates a traffic fine by verifying the category and checking if it's already paid.
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateFine(
            @RequestParam String referenceNumber,
            @RequestParam Long categoryId,
            @RequestParam String officerBadge) {
        try {
            ValidateFineResponse response = fineService.validateFine(referenceNumber, categoryId, officerBadge);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            log.warn("Fine validation failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + ex.getMessage() + "\"}");
        } catch (Exception ex) {
            log.error("Unexpected error during fine validation", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An unexpected error occurred\"}");
        }
    }
}
