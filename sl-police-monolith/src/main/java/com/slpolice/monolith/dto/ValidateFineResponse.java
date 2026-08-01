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
    // Without this, Lombok's isAlreadyPaid() getter makes Jackson emit "alreadyPaid",
    // which does not match the documented contract or the mobile/motorist clients.
    @JsonProperty("isAlreadyPaid")
    private boolean isAlreadyPaid;
}
