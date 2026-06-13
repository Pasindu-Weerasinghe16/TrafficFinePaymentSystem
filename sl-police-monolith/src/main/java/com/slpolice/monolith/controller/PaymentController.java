package com.slpolice.monolith.controller;

import com.slpolice.monolith.dto.PaymentRequest;
import com.slpolice.monolith.dto.PaymentResponse;
import com.slpolice.monolith.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/payments
     * Processes a traffic fine payment.
     * Saves TrafficFine and Payment records, then sends a mock SMS to the officer.
     */
    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentService.processPayment(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException ex) {
            log.warn("Payment rejected: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"error\": \"" + ex.getMessage() + "\"}");
        } catch (IllegalArgumentException ex) {
            log.warn("Payment failed due to bad input: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + ex.getMessage() + "\"}");
        } catch (Exception ex) {
            log.error("Unexpected error during payment processing", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"An unexpected error occurred\"}");
        }
    }
}
