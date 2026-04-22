package com.smartseat.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class CoordinatorTest {

    @Test
    void constructorSetsNameAndEmail() {
        Coordinator coordinator = new Coordinator("Alex", "alex@example.com");

        assertEquals("Alex", coordinator.getName());
        assertEquals("alex@example.com", coordinator.getEmail());
        assertNull(coordinator.getDepartmentID());
        assertNull(coordinator.getPassword());
    }

    @Test
    void settersAndGettersRoundTripValues() {
        Coordinator coordinator = new Coordinator();

        coordinator.setName("Taylor");
        coordinator.setEmail("taylor@example.com");
        coordinator.setDepartmentID("D001");
        coordinator.setPassword("secret");

        assertEquals("Taylor", coordinator.getName());
        assertEquals("taylor@example.com", coordinator.getEmail());
        assertEquals("D001", coordinator.getDepartmentID());
        assertEquals("secret", coordinator.getPassword());
    }
}
