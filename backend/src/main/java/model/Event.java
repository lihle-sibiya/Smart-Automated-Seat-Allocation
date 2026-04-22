package main.java.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;

    private int capacity = 20;

    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private Coordinator coordinator;

    // Employees allocated to this event
    @ManyToMany
    @JoinTable(
        name = "event_employee",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employee> employees;

    public Event() {}

    public Event(String name, LocalDateTime startTime, LocalDateTime endTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public Coordinator getCoordinator() { return coordinator; }
    public void setCoordinator(Coordinator coordinator) { this.coordinator = coordinator; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
}
