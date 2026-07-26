package com.slpolice.monolith.dto;

import com.slpolice.monolith.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment record as shown in the admin portal's fine detail view
 * (GET /api/payments/fine/{id}).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryResponse {
    private String transactionId;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDateTime paidAt;

    public static PaymentHistoryResponse from(Payment payment) {
        return PaymentHistoryResponse.builder()
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmountPaid())
                .paymentMethod(payment.getPaymentMethod())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
