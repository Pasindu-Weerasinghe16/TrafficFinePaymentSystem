package com.slpolice.monolith.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsService {

    /**
     * Mock SMS service — logs the message instead of sending a real SMS.
     * Replace this with a real SMS gateway (e.g., Twilio, Dialog, etc.) in production.
     */
    public void sendSms(String phoneNumber, String message) {
        log.info("[MOCK SMS] To: {} | Message: {}", phoneNumber, message);
        // In production: call external SMS gateway API here
    }
}
