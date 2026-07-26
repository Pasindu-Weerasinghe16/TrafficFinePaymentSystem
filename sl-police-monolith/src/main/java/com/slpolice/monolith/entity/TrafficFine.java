package com.slpolice.monolith.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_fines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String referenceNumber;

    // Vehicle-centric fields used by the admin (issue) and motorist (lookup/pay) portals.
    private String vehicleNumber;

    // Denormalised amount: copied from the category for on-the-spot fines, or set directly
    // for admin-issued fines (which have no category).
    private BigDecimal amount;

    @Column(length = 500)
    private String description;

    // Stored as the raw date string supplied by the admin portal (e.g. "2026-08-01"); nullable.
    private String dueDate;

    // Category and officer are only present for on-the-spot fines issued via the mobile app.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private FineCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private Officer officer;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

}
