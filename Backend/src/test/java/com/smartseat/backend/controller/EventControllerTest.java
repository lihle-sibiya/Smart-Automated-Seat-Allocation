package com.smartseat.backend.controller;

import com.smartseat.backend.model.Event;
import com.smartseat.backend.service.EventService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EventControllerTest {

    @Test
    void getUpcomingTimeslotsMapsEventsToResponseObjects() {
        EventService eventService = Mockito.mock(EventService.class);
        EventController controller = new EventController(eventService);
        LocalDate date = LocalDate.of(2026, 4, 24);
        LocalDateTime start = date.atTime(9, 0);
        LocalDateTime end = date.atTime(10, 0);

        Event event = new Event();
        event.setName("Planning Session");
        event.setDate(date);
        event.setStartTime(start);
        event.setEndTime(end);

        Mockito.when(eventService.getUpcomingEvents()).thenReturn(List.of(event));

        List<EventController.EventTimeslotResponse> response = controller.getUpcomingTimeslots();

        assertEquals(1, response.size());
        assertEquals("Planning Session", response.get(0).getEventName());
        assertEquals(date, response.get(0).getDate());
        assertEquals(start, response.get(0).getStartTime());
        assertEquals(end, response.get(0).getEndTime());
    }
}
