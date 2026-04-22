package main.java.model;

import jakarta.persistence.*;

@Entity
public class Coordinator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String departmentID;
    private String password;

    // Constructors
    public Coordinator() {}

    public Coordinator(String name, String email ) {
        this.name = name;
        this.email = email;
    }

    // Getters & Setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartmentID() { return departmentID; }
    public void setDepartmentID(String departmentID) { this.departmentID = departmentID; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
