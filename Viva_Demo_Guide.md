# 🎓 UniOps Viva Demonstration Guide

This guide will help you walk through the **Incident Ticket Lifecycle** using the Postman collection. Since User Management is simulated, follow these exact steps to impress your examiners.

---

## 🛠️ Global Configuration
Before starting, ensure your Spring Boot server is running on port **8089**.
- In Postman, click on the **UniOps Viva Demo Collection** folder.
- Go to the **Variables** tab.
- Check that `base_url` is `http://localhost:8089`.

---

## 🚩 Phase 1: Student Submission (The Reporting Stage)

### Request: `1. Report Incident`
This is a **Multipart** request. It mimics a student filling out a form and attaching a photo.

| Key | Type | Value (Example) | Description |
| :--- | :--- | :--- | :--- |
| **ticket** | **Text (JSON)** | See Below | This is the main data object. |
| **files** | **File** | *(Choose any image)* | Optional photo of the damage. |

#### 📝 The JSON Value for `ticket`:
Copy and paste this into the **Value** column for the `ticket` key:
```json
{
  "resourceLocation": "Computer Lab 04 - Desk 12",
  "category": "Hardware",
  "description": "The PC is making a loud clicking noise and won't boot.",
  "priority": "HIGH",
  "contactEmail": "student@uni.edu",
  "contactPhone": "0771234567",
  "createdByUserId": 1001
}
```

> [!TIP]
> **Viva Talking Point**: "Since the User Management module is in development, we are explicitly passing `createdByUserId: 1001`. In production, this ID would be automatically pulled from the JWT authentication token."

---

## 🏛️ Phase 2: Admin Operations (The Dispatch Stage)

### Request: `1. View All Pending Missions`
- **Goal**: Show that the ticket was successfully stored in MongoDB.
- **Viva Point**: "The Admin sees a real-time list of 'OPEN' tickets that need attention."

### Request: `2. Dispatch Technician`
- **Body**:
  ```json
  {
    "technicianId": 2002,
    "technicianName": "Agent Smith"
  }
  ```
- **Goal**: This updates the ticket and assigns it to a specific staff member.

---

## 🔧 Phase 3: Technician Execution (The Resolution Stage)

### Request: `1. Accept & Start Work`
- **Goal**: Changes status to `IN_PROGRESS`.
- **Note**: Notice how we use `resolutionNote: "STARTED_BY_TECH"`. This tells the system the tech is actually on-site.

### Request: `2. Add Operational Comment`
- **Goal**: Simulates the tech talking back to the user.
- **Body**: "Checked the hard drive. Replacing it now."

### Request: `3. Mark as Resolved`
- **Goal**: Finalizes the fix.
- **Viva Point**: "Once resolved, the student is notified that their problem is fixed."

---

## 🌟 Phase 4: Feedback Loop (The Satisfaction Stage)

### Request: `1. Submit User Feedback`
- **Body**: `{"rating": 5, "comment": "Fast and professional!"}`
- **Goal**: Completes the lifecycle.

---

## 💡 Pro-Tips for your Viva:
1. **The ID Magic**: Tell the examiners: *"I have automated the ID passing. When I create a ticket in Phase 1, Postman scripts automatically store the new Ticket ID in an environment variable, so Phase 2, 3, and 4 know exactly which ticket we are working on."*
2. **MongoDB**: Mention that all this data is being stored in a **Document-based NoSQL database (MongoDB)**, which allows for flexible categories and attachment metadata.
3. **The 'Viva' Port**: Remind them that the server is listening on port `8089` as configured in `application.properties`.
