package com.slpolice.monolith.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String badgeNumber;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String district;

}
