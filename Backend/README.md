# Backend Bootstrap

Minimal Spring Boot backend bootstrap with MySQL wiring and main class.

## What is included

- `pom.xml` with Web, JPA, MySQL, Test dependencies
- Main class: `src/main/java/com/smartseat/backend/BackendApplication.java`
- MySQL config: `src/main/resources/application.properties`
- Local override template: `src/main/resources/application-local.properties`

## Quick run

1. Set your DB password in environment variable `MYSQL_PASSWORD` or in `application-local.properties`.
2. Start backend:

```bash
mvn spring-boot:run
```

