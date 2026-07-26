package com.slpolice.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for motorist self-registration (POST /api/auth/register).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
}
