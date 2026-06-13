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
    private String referenceNumber;
    private Long categoryId;
    private String officerBadgeNumber;
    private String location;
    private Map<String, Object> paymentDetails;
}
