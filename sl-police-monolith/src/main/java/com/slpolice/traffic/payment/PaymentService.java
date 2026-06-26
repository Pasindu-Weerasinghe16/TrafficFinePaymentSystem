package com.slpolice.traffic.payment;

import com.slpolice.traffic.fine.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final FineRepository fineRepo;
    private final FineService fineService;

    public Payment pay(PaymentRequest req) {
        TrafficFine fine = fineRepo.findById(req.getFineId())
                .orElseThrow(() -> new RuntimeException("Fine not found"));
        if (fine.getStatus() != TrafficFine.Status.PENDING)
            throw new RuntimeException("Fine is not payable (status: " + fine.getStatus() + ")");

        Payment p = new Payment();
        p.setFine(fine);
        p.setAmount(fine.getAmount());
        p.setPaidAt(LocalDateTime.now());
        p.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        p.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "CARD");
        if (req.getCardNumber() != null && req.getCardNumber().length() >= 4)
            p.setCardLastFour(req.getCardNumber().replaceAll("\\s", "").substring(
                    req.getCardNumber().replaceAll("\\s","").length() - 4));

        fineService.markPaid(fine.getId());
        return paymentRepo.save(p);
    }

    public List<Payment> getAll() { return paymentRepo.findAll(); }
    public List<Payment> getByFine(Long fineId) { return paymentRepo.findByFineId(fineId); }
}
