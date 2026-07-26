package com.slpolice.monolith.repository;

import com.slpolice.monolith.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFineIdOrderByPaidAtDesc(Long fineId);
}
