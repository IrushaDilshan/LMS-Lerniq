# API Request/Response Examples - Module A

## Complete Reference for All 6 Endpoints

---

## 1. GET /api/resources - List All Resources

### Request
```http
GET /api/resources HTTP/1.1
Host: localhost:8088
Accept: application/json
```

### Query Parameters
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| type | String | No | LECTURE_HALL |
| location | String | No | Building%20A |
| minCapacity | Integer | No | 50 |
| activeOnly | Boolean | No | true |

### Example Requests
```
GET /api/resources
GET /api/resources?activeOnly=true
GET /api/resources?type=LAB&minCapacity=30
GET /api/resources?location=Building%20A&type=LECTURE_HALL
```

### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Main Lecture Hall",
    "type": "LECTURE_HALL",
    "capacity": 150,
    "location": "Building A, Floor 3",
    "description": "State-of-the-art lecture hall with AV systems",
    "status": "ACTIVE",
    "availabilityWindows": [
      {
        "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "08:00",
        "endTime": "18:00"
      },
      {
        "daysOfWeek": ["Saturday"],
        "startTime": "09:00",
        "endTime": "14:00"
      }
    ],
    "createdAt": "2026-04-25T10:30:00",
    "updatedAt": "2026-04-25T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Lab B1",
    "type": "LAB",
    "capacity": 40,
    "location": "Building B, Floor 1",
    "description": "Equipment lab with workstations",
    "status": "ACTIVE",
    "availabilityWindows": [
      {
        "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "09:00",
        "endTime": "17:00"
      }
    ],
    "createdAt": "2026-04-25T11:00:00",
    "updatedAt": "2026-04-25T11:00:00"
  }
]
```

### Response (Empty List)
```json
[]
```

---

## 2. GET /api/resources/{id} - Get Single Resource

### Request
```http
GET /api/resources/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8088
Accept: application/json
```

### Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Main Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 150,
  "location": "Building A, Floor 3",
  "description": "State-of-the-art lecture hall with AV systems",
  "status": "ACTIVE",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ],
  "createdAt": "2026-04-25T10:30:00",
  "updatedAt": "2026-04-25T10:30:00"
}
```

### Response (404 Not Found)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: invalid_id",
  "path": "/api/resources/invalid_id"
}
```

---

## 3. POST /api/resources - Create Resource

### Request
```http
POST /api/resources HTTP/1.1
Host: localhost:8088
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "New Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 200,
  "location": "Building C, Floor 2",
  "description": "Recently renovated lecture hall",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ]
}
```

### Request Body Schema
```json
{
  "name": "string (required, non-empty)",
  "type": "LECTURE_HALL | LAB | MEETING_ROOM | EQUIPMENT",
  "capacity": "integer (required, >= 1)",
  "location": "string (required, non-empty)",
  "description": "string (optional)",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", ...],
      "startTime": "HH:mm",
      "endTime": "HH:mm"
    }
  ]
}
```

### Response (201 Created)
```json
{
  "id": "507f1f77bcf86cd799439013",
  "name": "New Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 200,
  "location": "Building C, Floor 2",
  "description": "Recently renovated lecture hall",
  "status": "ACTIVE",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ],
  "createdAt": "2026-04-25T12:00:00",
  "updatedAt": "2026-04-25T12:00:00"
}
```

### Response (400 Bad Request - Validation Error)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Resource name is required",
  "path": "/api/resources"
}
```

### Response (400 Bad Request - Missing Field)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Capacity must be at least 1",
  "path": "/api/resources"
}
```

### Response (403 Forbidden - Not ADMIN)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied - Admin role required",
  "path": "/api/resources"
}
```

---

## 4. PUT /api/resources/{id} - Update Resource

### Request
```http
PUT /api/resources/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8088
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Updated Lecture Hall Name",
  "capacity": 250,
  "location": "Building A, Floor 4"
}
```

### Request Body Schema (All fields optional)
```json
{
  "name": "string (optional)",
  "type": "LECTURE_HALL | LAB | MEETING_ROOM | EQUIPMENT (optional)",
  "capacity": "integer (optional, >= 1 if provided)",
  "location": "string (optional)",
  "description": "string (optional)",
  "availabilityWindows": [
    {
      "daysOfWeek": ["string"],
      "startTime": "HH:mm",
      "endTime": "HH:mm"
    }
  ]
}
```

### Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Updated Lecture Hall Name",
  "type": "LECTURE_HALL",
  "capacity": 250,
  "location": "Building A, Floor 4",
  "description": "State-of-the-art lecture hall with AV systems",
  "status": "ACTIVE",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ],
  "createdAt": "2026-04-25T10:30:00",
  "updatedAt": "2026-04-25T13:45:00"
}
```

### Response (404 Not Found)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: 507f1f77bcf86cd799439999",
  "path": "/api/resources/507f1f77bcf86cd799439999"
}
```

### Response (400 Bad Request)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Capacity must be at least 1",
  "path": "/api/resources/507f1f77bcf86cd799439011"
}
```

---

## 5. DELETE /api/resources/{id} - Delete Resource

### Request
```http
DELETE /api/resources/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:8088
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (204 No Content)
```
(No body - Just status code 204)
```

### Response (404 Not Found)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: 507f1f77bcf86cd799439999",
  "path": "/api/resources/507f1f77bcf86cd799439999"
}
```

### Response (403 Forbidden)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied - Admin role required",
  "path": "/api/resources/507f1f77bcf86cd799439011"
}
```

---

## 6. PATCH /api/resources/{id}/status - Update Status

### Request
```http
PATCH /api/resources/507f1f77bcf86cd799439011/status HTTP/1.1
Host: localhost:8088
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "status": "OUT_OF_SERVICE"
}
```

### Request Body Schema
```json
{
  "status": "ACTIVE | OUT_OF_SERVICE (required)"
}
```

### Response (200 OK - Changed to OUT_OF_SERVICE)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Main Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 150,
  "location": "Building A, Floor 3",
  "description": "State-of-the-art lecture hall with AV systems",
  "status": "OUT_OF_SERVICE",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ],
  "createdAt": "2026-04-25T10:30:00",
  "updatedAt": "2026-04-25T14:00:00"
}
```

### Response (200 OK - Changed to ACTIVE)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Main Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 150,
  "location": "Building A, Floor 3",
  "description": "State-of-the-art lecture hall with AV systems",
  "status": "ACTIVE",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ],
  "createdAt": "2026-04-25T10:30:00",
  "updatedAt": "2026-04-25T14:05:00"
}
```

### Response (400 Bad Request - Invalid Status)
```json
{
  "error": "Invalid status. Must be ACTIVE or OUT_OF_SERVICE"
}
```

### Response (404 Not Found)
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: 507f1f77bcf86cd799439999",
  "path": "/api/resources/507f1f77bcf86cd799439999/status"
}
```

---

## HTTP Headers

### Common Request Headers
```
Accept: application/json
Content-Type: application/json (for POST, PUT, PATCH)
Authorization: Bearer <token> (for protected endpoints)
```

### Common Response Headers
```
Content-Type: application/json
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: * (CORS enabled)
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "timestamp": "ISO 8601 datetime",
  "status": "HTTP status code",
  "error": "Error type",
  "message": "Descriptive message",
  "path": "Request path"
}
```

### Example Error Responses

**Validation Error (400)**
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Resource name is required",
  "path": "/api/resources"
}
```

**Not Found (404)**
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: invalid_id",
  "path": "/api/resources/invalid_id"
}
```

**Forbidden (403)**
```json
{
  "timestamp": "2026-04-25T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied - Admin role required",
  "path": "/api/resources"
}
```

---

## Status Codes Summary

| Code | Reason | Endpoint |
|------|--------|----------|
| 200 | OK | GET, PUT, PATCH |
| 201 | Created | POST |
| 204 | No Content | DELETE |
| 400 | Bad Request (Validation) | POST, PUT, PATCH |
| 403 | Forbidden (Auth) | POST, PUT, DELETE, PATCH |
| 404 | Not Found | GET, PUT, DELETE, PATCH |

---

## Valid Enum Values

### ResourceType
```
LECTURE_HALL
LAB
MEETING_ROOM
EQUIPMENT
```

### ResourceStatus
```
ACTIVE
OUT_OF_SERVICE
```

### Days of Week
```
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

### Time Format
```
HH:mm (24-hour format)
Examples: 08:00, 14:30, 17:45
```

---

## Pagination & Filtering

### Query Parameters (GET /api/resources)
All are optional and can be combined:

```
?type=LECTURE_HALL
?location=Building%20A
?minCapacity=50
?activeOnly=true

Combined:
?type=LAB&location=Building%20B&minCapacity=30&activeOnly=true
```

---

## Authentication Notes

⚠️ **ADMIN-only endpoints require authentication:**
- POST /api/resources
- PUT /api/resources/{id}
- DELETE /api/resources/{id}
- PATCH /api/resources/{id}/status

**Request:**
```
Authorization: Bearer <OAuth2_Token_With_ADMIN_Role>
```

**Without auth or wrong role:** 403 Forbidden response

---

## Field Validation Rules

| Field | Required | Type | Rules |
|-------|----------|------|-------|
| name | Yes | String | Not blank, max 255 chars |
| type | Yes | Enum | LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT |
| capacity | Yes | Integer | >= 1, <= 10000 |
| location | Yes | String | Not blank, max 255 chars |
| description | No | String | Max 1000 chars |
| availabilityWindows | No | Array | Can be empty |
| status | Auto | Enum | ACTIVE (new), OUT_OF_SERVICE |

---

**Last Updated:** April 25, 2026  
**Module:** A - Facilities & Assets Catalogue  
**API Version:** 1.0.0
