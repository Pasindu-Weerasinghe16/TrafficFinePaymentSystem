package com.slpolice.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Payload for issuing a fine from the admin portal (POST /api/fines).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FineRequest {
    private String vehicleNumber;
    private BigDecimal amount;
    private String location;
    private String dueDate;
    private String description;
}
