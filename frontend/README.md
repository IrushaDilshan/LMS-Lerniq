# UniOps - Smart Campus Operations Hub

## IT3030 - Programming Applications and Frameworks
### Group Assignment 2026 - Semester 1

---

## Project Overview
A university campus management system built with Spring Boot REST API and React frontend.

---

## Module A - Facilities & Assets Catalogue
### Developer: [Chamathki E.G.G.J]

### API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/resources | Get all resources with filters | Public |
| GET | /api/resources/{id} | Get resource by ID | Public |
| POST | /api/resources | Create new resource | Admin Only |
| PUT | /api/resources/{id} | Update resource | Admin Only |
| DELETE | /api/resources/{id} | Delete resource | Admin Only |
| PATCH | /api/resources/{id}/status | Update resource status | Admin Only |

### Filter Parameters
- **type** - LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT
- **location** - partial case-insensitive search
- **minCapacity** - minimum capacity filter
- **activeOnly** - show only active resources

---

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Spring Boot
- **Database:** MongoDB
- **Authentication:** OAuth 2.0 (Google)
- **Version Control:** GitHub + GitHub Actions

---

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
