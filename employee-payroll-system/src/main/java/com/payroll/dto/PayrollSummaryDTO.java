package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PayrollSummaryDTO {

    private long totalEmployees;
    private double totalPayroll;
    private double averageSalary;
    private double highestSalary;

}