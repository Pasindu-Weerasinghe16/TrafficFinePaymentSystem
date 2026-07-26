package com.slpolice.monolith.dto;

import com.slpolice.monolith.entity.TrafficFine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Flat view of a traffic fine as consumed by the admin and motorist portals.
 * Avoids exposing lazy JPA associations directly and gives the portals the
 * exact field names they expect (vehicleNumber, amount, issueDate, ...).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FineResponse {
    private Long id;
    private String referenceNumber;
    private String vehicleNumber;
    private BigDecimal amount;
    private String categoryName;
    private String officerBadge;
    private String location;
    private String status;
    private String description;
    private LocalDateTime issueDate;
    private String dueDate;

    public static FineResponse from(TrafficFine fine) {
        return FineResponse.builder()
                .id(fine.getId())
                .referenceNumber(fine.getReferenceNumber())
                .vehicleNumber(fine.getVehicleNumber())
                .amount(fine.getAmount())
                .categoryName(fine.getCategory() != null ? fine.getCategory().getName() : null)
                .officerBadge(fine.getOfficer() != null ? fine.getOfficer().getBadgeNumber() : null)
                .location(fine.getLocation())
                .status(fine.getStatus())
                .description(fine.getDescription())
                .issueDate(fine.getIssuedAt())
                .dueDate(fine.getDueDate())
                .build();
    }
}
