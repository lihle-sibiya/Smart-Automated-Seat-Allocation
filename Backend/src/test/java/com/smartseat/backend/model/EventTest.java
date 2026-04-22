package com.smartseat.backend.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EventTest {

    @Test
    void constructorSetsCoreFields() {
        LocalDateTime start = LocalDateTime.of(2026, 4, 23, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 4, 23, 10, 0);

        Event event = new Event("Planning", start, end);

        assertEquals("Planning", event.getName());
        assertEquals(start, event.getStartTime());
        assertEquals(end, event.getEndTime());
        assertEquals(20, event.getCapacity());
    }

    @Test
    void settersAndGettersRoundTripValues() {
        Event event = new Event();
        Coordinator coordinator = new Coordinator("Chris", "chris@example.com");
        Employee employee = new Employee("Jordan", "jordan@example.com", "D004");
        LocalDate date = LocalDate.of(2026, 4, 25);
        LocalDateTime start = date.atTime(14, 0);
        LocalDateTime end = date.atTime(15, 0);

        event.setName("Review");
        event.setDate(date);
        event.setStartTime(start);
        event.setEndTime(end);
        event.setCapacity(50);
        event.setCoordinator(coordinator);
        event.setEmployees(List.of(employee));

        assertEquals("Review", event.getName());
        assertEquals(date, event.getDate());
        assertEquals(start, event.getStartTime());
        assertEquals(end, event.getEndTime());
        assertEquals(50, event.getCapacity());
        assertEquals(coordinator, event.getCoordinator());
        assertEquals(List.of(employee), event.getEmployees());
    }
}
