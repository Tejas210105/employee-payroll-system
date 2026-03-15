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

@Service
public class SalaryService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public SalaryResponseDTO calculateSalary(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        double baseSalary = employee.getBaseSalary();

        double calculatedSalary = baseSalary * 1.10;

        BonusCalculator bonusCalculator = (salary) -> salary * 0.10;

        double bonus = bonusCalculator.applyBonus(calculatedSalary);

        double finalSalary = calculatedSalary + bonus;

        finalSalary = Math.round(finalSalary * 100.0) / 100.0;

        return new SalaryResponseDTO(
                employee.getId(),
                employee.getName(),
                baseSalary,
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
                .mapToDouble(Employee::getBaseSalary)
                .sum();

        double averageSalary = employees.stream()
                .mapToDouble(Employee::getBaseSalary)
                .average()
                .orElse(0);

        double highestSalary = employees.stream()
                .map(Employee::getBaseSalary)
                .max(Comparator.naturalOrder())
                .orElse(0.0);

        return new PayrollSummaryDTO(
                totalEmployees,
                totalPayroll,
                averageSalary,
                highestSalary);
    }
}