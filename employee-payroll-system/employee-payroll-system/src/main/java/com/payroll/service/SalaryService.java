package com.payroll.service;

import com.payroll.dto.SalaryResponseDTO;
import com.payroll.model.Employee;
import com.payroll.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.payroll.dto.PayrollSummaryDTO;
import java.util.Comparator;
import java.util.function.Function;
import com.payroll.dto.BonusRequestDTO;
import com.payroll.dto.BonusResponseDTO;

@Service
public class SalaryService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public SalaryResponseDTO calculateSalary(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        double baseSalary = employee.getBaseSalary();

        double bonus = employee.getBonus();

        double finalSalary = baseSalary + bonus;

        finalSalary = Math.round(finalSalary * 100.0) / 100.0;

        return new SalaryResponseDTO(
                employee.getId(),
                employee.getName(),
                baseSalary,
                bonus,
                finalSalary);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .collect(Collectors.toList());
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findAll()
                .stream()
                .filter(emp -> emp.getDepartment().equalsIgnoreCase(department))
                .collect(Collectors.toList());
    }

    public PayrollSummaryDTO getPayrollSummary() {

        var employees = employeeRepository.findAll();

        long totalEmployees = employees.size();

        double totalPayroll = employees.stream()
                .mapToDouble(emp -> emp.getBaseSalary() + emp.getBonus())
                .sum();

        double averageSalary = employees.stream()
                .mapToDouble(emp -> emp.getBaseSalary() + emp.getBonus())
                .average()
                .orElse(0);

        double highestSalary = employees.stream()
                .mapToDouble(emp -> emp.getBaseSalary() + emp.getBonus())
                .max()
                .orElse(0.0);

        return new PayrollSummaryDTO(
                totalEmployees,
                totalPayroll,
                averageSalary,
                highestSalary);
    }

    public double calculateBonusWithLambda(double baseSalary, String bonusType, double multiplier) {
        BonusCalculator calculator;

        switch (bonusType.toLowerCase()) {
            case "percentage":
                calculator = salary -> salary * (multiplier / 100.0);
                break;
            case "fixed":
                calculator = salary -> multiplier;
                break;
            case "tiered":
                calculator = salary -> {
                    if (salary > 100000) return salary * 0.15;
                    else if (salary > 50000) return salary * 0.10;
                    else return salary * 0.05;
                };
                break;
            case "performance":
                calculator = salary -> salary * multiplier * 0.01; // multiplier as performance score
                break;
            default:
                calculator = salary -> salary * 0.05; // default 5% bonus
        }

        return Math.round(calculator.applyBonus(baseSalary) * 100.0) / 100.0;
    }

    public BonusResponseDTO calculateBonus(BonusRequestDTO request) {
        double calculatedBonus = calculateBonusWithLambda(
            request.getBaseSalary(),
            request.getBonusType(),
            request.getMultiplier()
        );

        double totalSalary = request.getBaseSalary() + calculatedBonus;

        return new BonusResponseDTO(
            request.getBaseSalary(),
            request.getBonusType(),
            request.getMultiplier(),
            calculatedBonus,
            Math.round(totalSalary * 100.0) / 100.0
        );
    }
}