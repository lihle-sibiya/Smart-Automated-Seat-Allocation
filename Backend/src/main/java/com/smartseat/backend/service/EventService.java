package com.smartseat.backend.service;

import com.smartseat.backend.model.Event;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final List<Event> events = new ArrayList<>();

    public EventService() {
        seedEvents();
    }

    public List<Event> getUpcomingEvents() {
        LocalDate today = LocalDate.now();

        return events.stream()
            .filter(event -> event.getDate() != null && event.getDate().isAfter(today))
            .sorted(Comparator
                .comparing(Event::getDate)
                .thenComparing(Event::getStartTime))
            .collect(Collectors.toList());
    }

    public List<Event> getAllEvents() {
        return new ArrayList<>(events);
    }

    private void seedEvents() {
        if (!events.isEmpty()) {
            return;
        }

        events.add(createEvent("Team Standup", LocalDate.now().plusDays(1), LocalTime.of(9, 0), LocalTime.of(9, 30)));
        events.add(createEvent("Quarterly Planning", LocalDate.now().plusDays(2), LocalTime.of(10, 0), LocalTime.of(11, 30)));
        events.add(createEvent("Project Review", LocalDate.now().plusDays(3), LocalTime.of(14, 0), LocalTime.of(15, 0)));
    }

    private Event createEvent(String name, LocalDate date, LocalTime startTime, LocalTime endTime) {
        Event event = new Event();
        event.setName(name);
        event.setDate(date);
        event.setStartTime(date.atTime(startTime));
        event.setEndTime(date.atTime(endTime));
        return event;
    }
}
