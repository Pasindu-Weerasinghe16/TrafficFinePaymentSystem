package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.PaymentRequest;
import com.slpolice.monolith.dto.PaymentResponse;
import com.slpolice.monolith.entity.FineCategory;
import com.slpolice.monolith.entity.Officer;
import com.slpolice.monolith.entity.Payment;
import com.slpolice.monolith.entity.TrafficFine;
import com.slpolice.monolith.repository.FineCategoryRepository;
import com.slpolice.monolith.repository.OfficerRepository;
import com.slpolice.monolith.repository.PaymentRepository;
import com.slpolice.monolith.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TrafficFineRepository trafficFineRepository;
    private final PaymentRepository paymentRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final OfficerRepository officerRepository;
    private final SmsService smsService;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        // Step 1: Check if this fine reference was already paid
        trafficFineRepository.findByReferenceNumber(request.getReferenceNumber())
                .ifPresent(existing -> {
                    if ("PAID".equalsIgnoreCase(existing.getStatus())) {
                        throw new IllegalStateException("Fine with reference number " + request.getReferenceNumber() + " has already been paid.");
                    }
                });

        // Step 2: Find the fine category
        FineCategory category = fineCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Fine category not found with ID: " + request.getCategoryId()));

        // Step 3: Find the officer by badge number
        Officer officer = officerRepository.findByBadgeNumber(request.getOfficerBadgeNumber())
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with badge: " + request.getOfficerBadgeNumber()));

        // Step 4: Save TrafficFine record
        TrafficFine trafficFine = TrafficFine.builder()
                .referenceNumber(request.getReferenceNumber())
                .category(category)
                .officer(officer)
                .location(request.getLocation())
                .status("PAID")
                .issuedAt(LocalDateTime.now())
                .build();
        trafficFine = trafficFineRepository.save(trafficFine);

        // Step 5: Extract payment method from paymentDetails map
        String paymentMethod = "UNKNOWN";
        if (request.getPaymentDetails() != null && request.getPaymentDetails().containsKey("method")) {
            paymentMethod = request.getPaymentDetails().get("method").toString();
        }

        // Step 6: Save Payment record
        Payment payment = Payment.builder()
                .fine(trafficFine)
                .amountPaid(category.getAmount())
                .paymentMethod(paymentMethod)
                .paidAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // Step 7: Send mock SMS to the officer
        String smsMessage = String.format(
                "Payment received for fine ref: %s. Amount: LKR %.2f. Location: %s.",
                request.getReferenceNumber(), category.getAmount(), request.getLocation()
        );
        smsService.sendSms(officer.getPhoneNumber(), smsMessage);

        // Step 8: Generate receipt number
        String receiptNumber = "RCPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Payment processed successfully. Ref={}, Receipt={}", request.getReferenceNumber(), receiptNumber);

        return PaymentResponse.builder()
                .success(true)
                .receiptNumber(receiptNumber)
                .message("Payment successful. SMS sent to officer.")
                .build();
    }
}
