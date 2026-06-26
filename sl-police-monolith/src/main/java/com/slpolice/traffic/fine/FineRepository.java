package com.slpolice.traffic.fine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface FineRepository extends JpaRepository<TrafficFine, Long> {
    List<TrafficFine> findByVehicleNumberIgnoreCase(String vehicleNumber);
    long countByStatus(TrafficFine.Status status);
    @Query("SELECT COALESCE(SUM(f.amount),0) FROM TrafficFine f WHERE f.status = 'PAID'")
    BigDecimal totalRevenue();
}
