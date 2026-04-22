package com.smartseat.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeTest {

    @Test
    void constructorSetsEmployeeFields() {
        Employee employee = new Employee("Jamie", "jamie@example.com", "D002");

        assertEquals("Jamie", employee.getName());
        assertEquals("jamie@example.com", employee.getEmail());
        assertEquals("D002", employee.getDepartmentID());
    }

    @Test
    void settersAndGettersRoundTripValues() {
        Employee employee = new Employee();

        employee.setName("Sam");
        employee.setEmail("sam@example.com");
        employee.setDepartmentID("D003");

        assertEquals("Sam", employee.getName());
        assertEquals("sam@example.com", employee.getEmail());
        assertEquals("D003", employee.getDepartmentID());
    }
}
