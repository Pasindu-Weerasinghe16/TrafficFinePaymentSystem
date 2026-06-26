package com.slpolice.traffic.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> pay(@RequestBody PaymentRequest req) {
        return ResponseEntity.ok(paymentService.pay(req));
    }

    @GetMapping
    public List<Payment> getAll() { return paymentService.getAll(); }

    @GetMapping("/fine/{fineId}")
    public List<Payment> getByFine(@PathVariable Long fineId) {
        return paymentService.getByFine(fineId);
    }
}
