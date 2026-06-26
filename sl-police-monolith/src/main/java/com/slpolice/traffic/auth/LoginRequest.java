package com.slpolice.traffic.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
}
