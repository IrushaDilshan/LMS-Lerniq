# 🏫 Smart Campus Operations Hub

**IT3030 – Programming Applications and Frameworks (2026, Semester 1)**  
Faculty of Computing – SLIIT

---

## 📌 Project Overview

A full-stack web platform for managing university facility bookings, asset catalogues, and maintenance ticketing. Built with **Spring Boot REST API** and a **React** client web application.

| Detail | Info |
|--------|------|
| **Module** | IT3030 – PAF Assignment 2026 |
| **Stack** | Spring Boot 3.2 + React 18 + MySQL 8 |
| **Build Tool** | Maven (backend), Vite (frontend) |
| **Auth** | OAuth 2.0 (Google) + JWT |

---

## 👥 Team Contributions

| Member | Module | Responsibility |
|--------|--------|----------------|
| **Member 1** | Module A | Facilities & Assets Catalogue (Resources CRUD, search, filter) |
| Member 2 | Module B | Booking Management & conflict checking |
| Member 3 | Module C | Incident tickets, attachments, technician updates |
| Member 4 | Module D + E | Notifications, OAuth2, role management |

---

## 🗂️ Project Structure

```
smart-campus/
├── backend/                          # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/com/smartcampus/facilities/
│   │   │   ├── controller/           # REST controllers (HTTP layer)
│   │   │   │   └── ResourceController.java
│   │   │   ├── service/              # Business logic layer
│   │   │   │   └── ResourceService.java
│   │   │   ├── repository/           # JPA repositories (data layer)
│   │   │   │   └── ResourceRepository.java
│   │   │   ├── model/                # JPA entities + enums
│   │   │   │   ├── Resource.java
│   │   │   │   ├── ResourceType.java
│   │   │   │   └── ResourceStatus.java
│   │   │   ├── dto/                  # Request/Response DTOs
│   │   │   │   ├── ResourceDto.java
│   │   │   │   └── ApiResponse.java
│   │   │   ├── exception/            # Custom exceptions + global handler
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── DuplicateResourceException.java
│   │   │   └── config/
│   │   │       └── SecurityConfig.java
│   │   └── test/                     # Unit tests
│   └── pom.xml
│
├── frontend/                         # React client app
│   ├── src/
│   │   ├── components/
│   │   │   ├── resources/
│   │   │   │   ├── ResourceList.jsx  # Catalogue page
│   │   │   │   └── ResourceFormModal.jsx
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ResourceDetail.jsx
│   │   ├── services/
│   │   │   └── resourceService.js    # Axios API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT auth state
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .github/
    └── workflows/
        └── ci.yml                    # GitHub Actions CI
```

---

## ⚙️ Prerequisites

Make sure these are installed before running:

- **Java 17+** – [Download](https://adoptium.net/)
- **Maven 3.8+** – [Download](https://maven.apache.org/)
- **Node.js 20+** – [Download](https://nodejs.org/)
- **MySQL 8+** – [Download](https://dev.mysql.com/downloads/)

---

## 🚀 Setup & Run Guide

### Step 1 – Database Setup

```sql
CREATE DATABASE smart_campus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2 – Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3 – Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API will start at: `http://localhost:8080/api`

### Step 4 – Run Frontend

```bash
cd frontend
npm install
npm run dev
```

App will open at: `http://localhost:5173`

---

## 📡 API Endpoints – Member 1 (Facilities & Assets)

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/resources` | Create a new resource | ADMIN |
| `GET` | `/resources` | List / search all resources (paginated) | USER, ADMIN |
| `GET` | `/resources/{id}` | Get resource by ID | USER, ADMIN |
| `PUT` | `/resources/{id}` | Full update of a resource | ADMIN |
| `PATCH` | `/resources/{id}/status` | Update resource status only | ADMIN |
| `DELETE` | `/resources/{id}` | Delete a resource | ADMIN |
| `GET` | `/resources/stats` | Get statistics summary | ADMIN |

### Query Parameters for `GET /resources`

| Param | Type | Description |
|-------|------|-------------|
| `keyword` | string | Search in name / description |
| `type` | enum | `LECTURE_HALL`, `LAB`, `MEETING_ROOM`, `EQUIPMENT`, `AUDITORIUM`, `STUDY_ROOM` |
| `status` | enum | `ACTIVE`, `OUT_OF_SERVICE`, `UNDER_MAINTENANCE`, `DECOMMISSIONED` |
| `location` | string | Partial match on location |
| `minCapacity` | int | Minimum capacity filter |
| `page` | int | Page number (0-based, default 0) |
| `size` | int | Page size (default 10) |
| `sort` | string | Sort field (default: `name`) |
| `direction` | string | `ASC` or `DESC` |

### Sample Request – Create Resource

```json
POST /api/resources
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "name": "Computer Lab A101",
  "type": "LAB",
  "location": "Block A, Floor 1",
  "capacity": 40,
  "description": "Fully equipped computer lab with 40 workstations",
  "status": "ACTIVE",
  "building": "Engineering Block",
  "floor": "1st Floor",
  "roomNumber": "A101",
  "availabilityWindows": ["MON 08:00-18:00", "TUE 08:00-18:00", "WED 08:00-17:00"]
}
```

### Sample Response

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Computer Lab A101",
    "type": "LAB",
    "location": "Block A, Floor 1",
    "capacity": 40,
    "status": "ACTIVE",
    "createdAt": "2026-04-11T10:30:00",
    "updatedAt": "2026-04-11T10:30:00"
  },
  "timestamp": "2026-04-11T10:30:00"
}
```

---

## 🧪 Running Tests

```bash
cd backend
mvn test
```

Tests use an **H2 in-memory database** — no MySQL setup needed for testing.

Test reports: `backend/target/surefire-reports/`

---

## 🔐 Authentication

The API uses **OAuth 2.0 with Google** and **JWT tokens**.

1. Visit `http://localhost:5173` → redirected to login
2. Click **"Sign in with Google"**
3. Google authenticates → backend issues a JWT
4. JWT is stored in `localStorage` and sent with every API request

**Roles:**
- `USER` – can browse catalogue, make bookings, submit tickets
- `ADMIN` – full access including resource management, booking approval

---

## 🔄 CI/CD – GitHub Actions

The `.github/workflows/ci.yml` workflow runs on every push and pull request:

1. **Backend job** – `mvn clean verify` (compiles + runs all tests)
2. **Frontend job** – `npm ci` + `npm run build` (production build check)

View CI runs under the **Actions** tab on GitHub.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Client (Vite)                 │
│  AuthContext → resourceService.js → React Query     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST (JSON)
                       ▼
┌─────────────────────────────────────────────────────┐
│              Spring Boot REST API                    │
│  Controller → Service → Repository                  │
│  Security: JWT OAuth2 Resource Server               │
└──────────────────────┬──────────────────────────────┘
                       │ JPA / Hibernate
                       ▼
              ┌─────────────────┐
              │   MySQL 8 DB    │
              │  smart_campus   │
              └─────────────────┘
```

---

## 📋 Non-Functional Requirements Met

| Requirement | Implementation |
|-------------|----------------|
| **Security** | JWT + OAuth2, `@PreAuthorize` role-based access |
| **Validation** | `@Valid`, `@NotBlank`, `@Min` on all DTOs |
| **Error Handling** | `GlobalExceptionHandler` – 400/404/409/500 |
| **Performance** | Paginated responses, indexed DB columns |
| **Scalability** | Stateless API (no sessions), layered architecture |
| **Auditability** | `@CreatedDate`, `@LastModifiedDate` on all entities |
| **Usability** | React UI with search, filter, pagination, toasts |

---

*IT3030 PAF Assignment 2026 – SLIIT Faculty of Computing*
