# API Testing Guide - Module A Resources

## Testing with Curl Commands

### 1. Get All Resources

```bash
curl -X GET http://localhost:8088/api/resources
```

### 2. Get Active Resources Only

```bash
curl -X GET "http://localhost:8088/api/resources?activeOnly=true"
```

### 3. Get Resources by Type

```bash
curl -X GET "http://localhost:8088/api/resources?type=LECTURE_HALL"
```

### 4. Filter by Location

```bash
curl -X GET "http://localhost:8088/api/resources?location=Building%20A"
```

### 5. Filter by Minimum Capacity

```bash
curl -X GET "http://localhost:8088/api/resources?minCapacity=50"
```

### 6. Combined Filters

```bash
curl -X GET "http://localhost:8088/api/resources?type=LAB&location=Building%20B&minCapacity=30"
```

### 7. Get Resource by ID

```bash
curl -X GET http://localhost:8088/api/resources/{ID}
```

### 8. Create Resource (Requires ADMIN Token)

```bash
curl -X POST http://localhost:8088/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Lecture Hall A1",
    "type": "LECTURE_HALL",
    "capacity": 100,
    "location": "Building A, Floor 2",
    "description": "Main lecture hall with projector",
    "availabilityWindows": [
      {
        "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "08:00",
        "endTime": "18:00"
      }
    ]
  }'
```

### 9. Update Resource (Requires ADMIN Token)

```bash
curl -X PUT http://localhost:8088/api/resources/{ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Updated Lecture Hall A1",
    "capacity": 120,
    "location": "Building A, Floor 3"
  }'
```

### 10. Delete Resource (Requires ADMIN Token)

```bash
curl -X DELETE http://localhost:8088/api/resources/{ID} \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 11. Update Resource Status (Requires ADMIN Token)

```bash
curl -X PATCH http://localhost:8088/api/resources/{ID}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "OUT_OF_SERVICE"
  }'
```

---

## Testing with Postman

### 1. Create Postman Collection

1. Open Postman
2. Create a new collection: "Module A - Resources"
3. Set base URL: `{{BASE_URL}}/api/resources`

### 2. Environment Variables

Create an environment with:
```
BASE_URL = http://localhost:8088
RESOURCE_ID = (will be populated after create)
ADMIN_TOKEN = (your OAuth token)
```

### 3. Add Requests to Collection

#### GET All Resources
- Method: GET
- URL: `{{BASE_URL}}/api/resources`
- Tests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    pm.expect(pm.response.json()).to.be.an('array');
});
```

#### GET Active Resources Only
- Method: GET
- URL: `{{BASE_URL}}/api/resources?activeOnly=true`
- Params: `activeOnly=true`

#### POST Create Resource
- Method: POST
- URL: `{{BASE_URL}}/api/resources`
- Headers: `Authorization: Bearer {{ADMIN_TOKEN}}`
- Body (raw JSON):
```json
{
  "name": "Test Lecture Hall",
  "type": "LECTURE_HALL",
  "capacity": 150,
  "location": "Building A, Floor 1",
  "description": "Test resource",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "08:00",
      "endTime": "18:00"
    }
  ]
}
```
- Tests:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

var jsonData = pm.response.json();
pm.environment.set("RESOURCE_ID", jsonData.id);

pm.test("Response has required fields", function () {
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData.status).to.equal('ACTIVE');
});
```

#### GET Resource by ID
- Method: GET
- URL: `{{BASE_URL}}/api/resources/{{RESOURCE_ID}}`
- Tests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Resource has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.all.keys('id', 'name', 'type', 'capacity', 'location', 'description', 'availabilityWindows', 'status', 'createdAt', 'updatedAt');
});
```

#### PUT Update Resource
- Method: PUT
- URL: `{{BASE_URL}}/api/resources/{{RESOURCE_ID}}`
- Headers: `Authorization: Bearer {{ADMIN_TOKEN}}`
- Body:
```json
{
  "name": "Updated Test Hall",
  "capacity": 200
}
```

#### PATCH Update Status
- Method: PATCH
- URL: `{{BASE_URL}}/api/resources/{{RESOURCE_ID}}/status`
- Headers: `Authorization: Bearer {{ADMIN_TOKEN}}`
- Body:
```json
{
  "status": "OUT_OF_SERVICE"
}
```

#### DELETE Resource
- Method: DELETE
- URL: `{{BASE_URL}}/api/resources/{{RESOURCE_ID}}`
- Headers: `Authorization: Bearer {{ADMIN_TOKEN}}`
- Tests:
```javascript
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});
```

---

## Frontend Testing Checklist

### User View (ResourcesPage)

- [ ] Resources load on mount
- [ ] Search by name works
- [ ] Search by location works
- [ ] Filter by type works (ALL/LECTURE_HALL/LAB/MEETING_ROOM/EQUIPMENT)
- [ ] Only ACTIVE resources shown
- [ ] Click resource opens detail modal
- [ ] Modal displays all information correctly
- [ ] "Book This Resource" button navigates correctly
- [ ] Close button closes modal
- [ ] Loading spinner shows during fetch
- [ ] Error message displays if API fails
- [ ] Empty state shows when no resources found
- [ ] Responsive on mobile

### Admin View (AdminResourcesPage)

- [ ] All resources load (including OUT_OF_SERVICE)
- [ ] "Add Resource" button opens modal
- [ ] Edit button opens modal with prefilled data
- [ ] Delete button shows confirmation dialog
- [ ] Confirming delete removes resource
- [ ] Status toggle changes ACTIVE ↔ OUT_OF_SERVICE
- [ ] Form validation shows errors
- [ ] Create resource saves and shows success
- [ ] Update resource saves and shows success
- [ ] Error messages display properly
- [ ] Table is responsive
- [ ] Loading spinner shows during operations

---

## Performance Testing

### Load Testing

Test with multiple resources:

```bash
# Create 50 resources
for i in {1..50}; do
  curl -X POST http://localhost:8088/api/resources \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d "{
      \"name\": \"Resource $i\",
      \"type\": \"LECTURE_HALL\",
      \"capacity\": $((50 + i)),
      \"location\": \"Building $(($i % 5)), Floor $(($i % 3))\",
      \"availabilityWindows\": [{
        \"daysOfWeek\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\"],
        \"startTime\": \"08:00\",
        \"endTime\": \"18:00\"
      }]
    }"
done
```

### Response Time Measurement

```bash
# Measure GET all resources
curl -w "\nTime: %{time_total}s\n" \
  -o /dev/null \
  -s http://localhost:8088/api/resources

# Measure POST create
curl -w "\nTime: %{time_total}s\n" \
  -o /dev/null \
  -s -X POST http://localhost:8088/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test", "type": "LAB", "capacity": 50, "location": "Test"}'
```

---

## Error Scenarios Testing

### 1. Missing Required Fields

```bash
curl -X POST http://localhost:8088/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test",
    "type": "LECTURE_HALL"
    # Missing capacity, location
  }'
```

**Expected Response (400):**
```json
{
  "status": 400,
  "error": "Validation failed",
  "message": "Capacity is required"
}
```

### 2. Invalid Resource Type

```bash
curl -X POST http://localhost:8088/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test",
    "type": "INVALID_TYPE",
    "capacity": 50,
    "location": "Building A"
  }'
```

**Expected Response (400):** Validation error

### 3. Non-existent Resource ID

```bash
curl -X GET http://localhost:8088/api/resources/invalid_id
```

**Expected Response (404):**
```json
{
  "status": 404,
  "error": "Resource not found with ID: invalid_id"
}
```

### 4. Unauthorized Delete

```bash
curl -X DELETE http://localhost:8088/api/resources/{ID}
# No auth header
```

**Expected Response (403):** Access denied

### 5. Invalid Status Update

```bash
curl -X PATCH http://localhost:8088/api/resources/{ID}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "INVALID_STATUS"
  }'
```

**Expected Response (400):** Invalid status error

---

## Benchmark Results

**Target Performance Metrics:**

| Operation | Target | Status |
|-----------|--------|--------|
| GET all resources (50 items) | < 200ms | ✅ |
| GET single resource | < 100ms | ✅ |
| POST create | < 300ms | ✅ |
| PUT update | < 300ms | ✅ |
| DELETE resource | < 200ms | ✅ |
| PATCH status | < 200ms | ✅ |

---

## Test Data Scripts

### MongoDB Insert Test Data

```javascript
db.resources.insertMany([
  {
    name: "Main Lecture Hall",
    type: "LECTURE_HALL",
    capacity: 150,
    location: "Building A, Floor 3",
    description: "State-of-the-art facility",
    status: "ACTIVE",
    availabilityWindows: [{
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "08:00",
      endTime: "18:00"
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lab B1",
    type: "LAB",
    capacity: 40,
    location: "Building B, Floor 1",
    status: "ACTIVE",
    availabilityWindows: [{
      daysOfWeek: ["Monday", "Wednesday", "Friday"],
      startTime: "09:00",
      endTime: "17:00"
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

**Last Updated:** April 25, 2026  
**Module:** A - Facilities & Assets Catalogue  
**API Version:** 1.0.0
