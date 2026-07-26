package com.slpolice.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private boolean success;
    private String receiptNumber;
    private String message;
    // Also expose transactionId/amount so the motorist portal (which reads these) works
    // off the same response as the mobile app (which reads success/receiptNumber).
    private String transactionId;
    private BigDecimal amount;
}
