# Employee Payroll System

A Spring Boot application for managing employee payroll including salary retrieval, bonus calculation, and payroll summary. Includes a lightweight frontend for user interaction.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Testing](#testing)
- [Authors](#authors)
- [License](#license)

## Project Structure

- `employee-payroll-system/`: Spring Boot backend module.
  - `src/main/java/com/payroll/`: source packages.
    - `controller`: REST controllers.
    - `dto`: data transfer objects.
    - `model`: entity models.
    - `repository`: data repository.
    - `service`: business logic.
  - `src/main/resources/application.properties`: Spring Boot configuration.
- `payroll-frontend/`: static frontend files (`index.html`, `script.js`, `style.css`).

## Features

- Employee details storage and retrieval
- Salary information endpoint
- Bonus calculation endpoint
- Payroll summary endpoint
- Minimal frontend UI for request testing

## Requirements

- Java 17+ (or as configured in project)
- Maven 3.6+
- Git (recommended)

## Setup

1. Clone repository:

```bash
git clone <your-repo-url>
cd employee-payroll-system
```

2. Build with Maven:

```bash
./mvnw clean package
```

> On Windows use `mvnw.cmd`.

## Running the Application

```bash
./mvnw spring-boot:run
```

Access API at `http://localhost:8080`.

## API Endpoints

Assuming default controller mappings, example endpoints:

### Get salary by employee ID

- Method: `GET`
- URL: `/api/employees/{id}/salary`

### Calculate bonus

- Method: `POST`
- URL: `/api/employees/{id}/bonus`
- Body:
  - `baseSalary`: number
  - `performanceScore`: number or enum as defined in DTO

### Payroll summary

- Method: `GET`
- URL: `/api/employees/{id}/summary`

Adjust routes as needed by inspecting `EmployeeController`.

## Frontend

Open `payroll-frontend/index.html` in a browser and use the form to call backend APIs. Ensure backend is running at `http://localhost:8080`.

## Testing

Run unit/integration tests with:

```bash
./mvnw test
```

## Authors

- Project maintainer: [Your Name]

## License

MIT License (or choose your preferred license).
