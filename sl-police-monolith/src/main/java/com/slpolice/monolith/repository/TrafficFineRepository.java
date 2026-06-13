package com.slpolice.monolith.repository;

import com.slpolice.monolith.entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TrafficFineRepository extends JpaRepository<TrafficFine, Long> {
    Optional<TrafficFine> findByReferenceNumber(String referenceNumber);
}
