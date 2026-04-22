package main.java.controller;

import main.java.model.Event;
import main.java.service.EventService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/timeslots")
    public List<EventTimeslotResponse> getUpcomingTimeslots() {
        return eventService.getUpcomingEvents().stream()
            .map(this::toTimeslotResponse)
            .toList();
    }

    private EventTimeslotResponse toTimeslotResponse(Event event) {
        return new EventTimeslotResponse(
            event.getName(),
            event.getDate(),
            event.getStartTime(),
            event.getEndTime()
        );
    }

    public static class EventTimeslotResponse {
        private String eventName;
        private LocalDate date;
        private LocalDateTime startTime;
        private LocalDateTime endTime;

        public EventTimeslotResponse(String eventName, LocalDate date, LocalDateTime startTime, LocalDateTime endTime) {
            this.eventName = eventName;
            this.date = date;
            this.startTime = startTime;
            this.endTime = endTime;
        }

        public String getEventName() { return eventName; }
        public void setEventName(String eventName) { this.eventName = eventName; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    }
}
