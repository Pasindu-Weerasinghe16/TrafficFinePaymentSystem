package com.slpolice.traffic.fine;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FineRequest {
    private String vehicleNumber;
    private BigDecimal amount;
    private String description;
    private String location;
    private LocalDate dueDate;
}
