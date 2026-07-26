package com.slpolice.monolith.controller;

import com.slpolice.monolith.dto.FineRequest;
import com.slpolice.monolith.dto.FineResponse;
import com.slpolice.monolith.dto.ValidateFineResponse;
import com.slpolice.monolith.service.FineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    /** GET /api/fines — all fines (admin portal list). */
    @GetMapping
    public ResponseEntity<List<FineResponse>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    /** GET /api/fines/vehicle/{vehicleNumber} — motorist portal lookup. */
    @GetMapping("/vehicle/{vehicleNumber}")
    public ResponseEntity<List<FineResponse>> getFinesForVehicle(@PathVariable String vehicleNumber) {
        return ResponseEntity.ok(fineService.getFinesForVehicle(vehicleNumber));
    }

    /** POST /api/fines — issue a new fine (admin portal). */
    @PostMapping
    public ResponseEntity<?> createFine(@RequestBody FineRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(fineService.createFine(request));
        } catch (Exception ex) {
            log.error("Error creating fine", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"Failed to issue fine\"}");
        }
    }

    /** GET /api/fines/{id} — fine detail (admin portal). */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFine(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(fineService.getFine(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

    /** PUT /api/fines/{id}/cancel — cancel a pending fine (admin portal). */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelFine(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(fineService.cancelFine(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"" + ex.getMessage() + "\"}");
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

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
