package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

public class SalaryResponseDTO {

    private Long employeeId;
    private String name;
    private double baseSalary;
    private double calculatedSalary;

}

