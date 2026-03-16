package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BonusRequestDTO {
    private double baseSalary;
    private String bonusType; // "percentage", "fixed", "tiered", "performance"
    private double multiplier; // percentage value, fixed amount, or performance score
}