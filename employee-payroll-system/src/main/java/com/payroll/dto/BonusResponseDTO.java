package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BonusResponseDTO {
    private double baseSalary;
    private String bonusType;
    private double multiplier;
    private double calculatedBonus;
    private double totalSalary;
}