package com.slpolice.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    // ── Motorist-portal flow: pay an existing, admin-issued fine by id ──
    private Long fineId;
    private String cardNumber;
    private String cardHolder;
    private String expiry;
    private String cvv;

    // ── Mobile on-the-spot flow: create-and-pay a fine by reference/category/officer ──
    private String referenceNumber;
    private Long categoryId;
    private String officerBadgeNumber;
    private String location;
    private Map<String, Object> paymentDetails;

    // Shared: explicit payment method (falls back to paymentDetails.method or "CARD").
    private String paymentMethod;
}
