package com.slpolice.monolith.service;

import com.slpolice.monolith.dto.PaymentHistoryResponse;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TrafficFineRepository trafficFineRepository;
    private final PaymentRepository paymentRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final OfficerRepository officerRepository;
    private final SmsService smsService;

    /**
     * Two payment flows share this endpoint:
     *  - motorist portal sends {@code fineId} (+ card details) to settle an existing fine;
     *  - mobile app sends {@code referenceNumber/categoryId/officerBadgeNumber} to create-and-pay
     *    an on-the-spot fine.
     */
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        if (request.getFineId() != null) {
            return payExistingFine(request);
        }
        return createAndPayFine(request);
    }

    /** Motorist-portal flow: settle a fine that was already issued via the admin portal. */
    private PaymentResponse payExistingFine(PaymentRequest request) {
        TrafficFine fine = trafficFineRepository.findById(request.getFineId())
                .orElseThrow(() -> new IllegalArgumentException("Fine not found with ID: " + request.getFineId()));

        if ("PAID".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException("Fine #" + fine.getId() + " has already been paid.");
        }
        if ("CANCELLED".equalsIgnoreCase(fine.getStatus())) {
            throw new IllegalStateException("Fine #" + fine.getId() + " has been cancelled and cannot be paid.");
        }

        fine.setStatus("PAID");
        trafficFineRepository.save(fine);

        BigDecimal amount = fine.getAmount() != null ? fine.getAmount() : BigDecimal.ZERO;
        String transactionId = newTransactionId();
        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD";

        Payment payment = Payment.builder()
                .fine(fine)
                .transactionId(transactionId)
                .amountPaid(amount)
                .paymentMethod(paymentMethod)
                .paidAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        if (fine.getOfficer() != null) {
            smsService.sendSms(fine.getOfficer().getPhoneNumber(),
                    String.format("Payment received for fine #%d (%s). Amount: LKR %.2f.",
                            fine.getId(), fine.getVehicleNumber(), amount));
        }

        log.info("Existing fine paid. FineId={}, Txn={}", fine.getId(), transactionId);
        return PaymentResponse.builder()
                .success(true)
                .receiptNumber(transactionId)
                .transactionId(transactionId)
                .amount(amount)
                .message("Payment successful.")
                .build();
    }

    /** Mobile on-the-spot flow: create a PAID fine from reference/category/officer. */
    private PaymentResponse createAndPayFine(PaymentRequest request) {
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
                .amount(category.getAmount())
                .location(request.getLocation())
                .status("PAID")
                .issuedAt(LocalDateTime.now())
                .build();
        trafficFine = trafficFineRepository.save(trafficFine);

        // Step 5: Extract payment method (explicit field, else paymentDetails.method, else UNKNOWN)
        String paymentMethod = "UNKNOWN";
        if (request.getPaymentMethod() != null) {
            paymentMethod = request.getPaymentMethod();
        } else if (request.getPaymentDetails() != null && request.getPaymentDetails().containsKey("method")) {
            paymentMethod = request.getPaymentDetails().get("method").toString();
        }

        // Step 6: Save Payment record
        String transactionId = newTransactionId();
        Payment payment = Payment.builder()
                .fine(trafficFine)
                .transactionId(transactionId)
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

        log.info("Payment processed successfully. Ref={}, Txn={}", request.getReferenceNumber(), transactionId);

        return PaymentResponse.builder()
                .success(true)
                .receiptNumber(transactionId)
                .transactionId(transactionId)
                .amount(category.getAmount())
                .message("Payment successful. SMS sent to officer.")
                .build();
    }

    /** Payment history for a fine, most recent first (admin portal fine-detail view). */
    public List<PaymentHistoryResponse> getPaymentsForFine(Long fineId) {
        return paymentRepository.findByFineIdOrderByPaidAtDesc(fineId).stream()
                .map(PaymentHistoryResponse::from)
                .collect(Collectors.toList());
    }

    private String newTransactionId() {
        return "RCPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
