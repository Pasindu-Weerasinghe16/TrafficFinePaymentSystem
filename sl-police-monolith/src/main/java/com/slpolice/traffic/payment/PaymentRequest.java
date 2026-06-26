package com.slpolice.traffic.payment;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long fineId;
    private String paymentMethod;
    private String cardNumber;
    private String cardHolder;
    private String expiry;
    private String cvv;
}
