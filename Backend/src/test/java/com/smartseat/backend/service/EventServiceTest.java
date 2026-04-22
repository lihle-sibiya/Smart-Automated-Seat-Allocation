package com.smartseat.backend.service;

import com.smartseat.backend.model.Event;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EventServiceTest {

    @Test
    void getAllEventsReturnsSeededEvents() {
        EventService service = new EventService();

        List<Event> events = service.getAllEvents();

        assertEquals(3, events.size());
        assertEquals("Team Standup", events.get(0).getName());
        assertEquals("Quarterly Planning", events.get(1).getName());
        assertEquals("Project Review", events.get(2).getName());
    }

    @Test
    void getUpcomingEventsReturnsOnlyFutureEventsSortedByDateAndTime() {
        EventService service = new EventService();

        List<Event> events = service.getUpcomingEvents();

        assertEquals(3, events.size());
        assertTrue(events.stream().allMatch(event -> event.getDate().isAfter(LocalDate.now())));
        assertTrue(events.get(0).getDate().isBefore(events.get(1).getDate())
            || events.get(0).getDate().isEqual(events.get(1).getDate()));
        assertTrue(events.get(1).getDate().isBefore(events.get(2).getDate())
            || events.get(1).getDate().isEqual(events.get(2).getDate()));
    }

    @Test
    void getAllEventsReturnsDefensiveCopy() {
        EventService service = new EventService();

        List<Event> events = service.getAllEvents();
        events.clear();

        assertEquals(3, service.getAllEvents().size());
    }
}
