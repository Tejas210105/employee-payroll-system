package com.payroll.service;

@FunctionalInterface
public interface BonusCalculator {

    double applyBonus(double salary);

}