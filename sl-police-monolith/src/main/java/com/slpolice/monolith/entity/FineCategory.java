package com.slpolice.monolith.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

// Lazy @ManyToOne targets reach Jackson as Hibernate proxies; without this the
// proxy's internal fields are treated as properties and serialization fails.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "fine_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FineCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal amount;

}
