package com.payroll.controller;

import com.payroll.model.Employee;
import com.payroll.repository.EmployeeRepository;
import com.payroll.service.SalaryService;
import com.payroll.dto.SalaryResponseDTO;
import com.payroll.dto.PayrollSummaryDTO;
import com.payroll.dto.BonusRequestDTO;
import com.payroll.dto.BonusResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

@Autowired
private EmployeeRepository employeeRepository;

@Autowired
private SalaryService salaryService;

@PostMapping("/add")
public Employee addEmployee(@RequestBody Employee employee){
return employeeRepository.save(employee);
}

@GetMapping("/salary/{id}")
public SalaryResponseDTO calculateSalary(@PathVariable Long id){
return salaryService.calculateSalary(id);
}

@GetMapping("/all")
public List<Employee> getAllEmployees(){
return salaryService.getAllEmployees();
}

@GetMapping("/payroll-summary")
public PayrollSummaryDTO payrollSummary(){
return salaryService.getPayrollSummary();
}

@PostMapping("/calculate-bonus")
public BonusResponseDTO calculateBonus(@RequestBody BonusRequestDTO request) {
    return salaryService.calculateBonus(request);
}

}