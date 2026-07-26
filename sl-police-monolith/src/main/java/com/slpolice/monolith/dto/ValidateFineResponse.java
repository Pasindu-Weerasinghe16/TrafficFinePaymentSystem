package com.slpolice.monolith.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidateFineResponse {
    private BigDecimal amount;
    private String categoryName;
    // Serialize as "isAlreadyPaid" (Jackson would otherwise drop the "is" prefix to "alreadyPaid"),
    // matching the mobile client's FineValidationResult contract.
    @JsonProperty("isAlreadyPaid")
    private boolean isAlreadyPaid;
}
