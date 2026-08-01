package com.slpolice.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficFineRequest {
    private String referenceNumber;
    private Long categoryId;
    private String officerBadgeNumber;
    private String location;
}
