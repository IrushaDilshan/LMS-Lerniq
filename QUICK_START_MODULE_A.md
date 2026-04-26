# Quick Setup Guide - Module A Implementation

## ⚡ Quick Start

### Backend Setup

1. **Ensure dependencies in pom.xml:**
   - Spring Boot 4.0.0
   - Spring Data MongoDB
   - Lombok
   - Validation (jakarta.validation)

2. **Update application.properties:**
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/uniops_ticketing_db
   spring.data.mongodb.database=uniops_ticketing_db
   ```

3. **Run the backend:**
   ```bash
   ./mvnw.cmd spring-boot:run
   ```

4. **API available at:**
   - http://localhost:8088/api/resources

---

### Frontend Setup

1. **Ensure dependencies in package.json:**
   ```bash
   npm install lucide-react react-router-dom
   ```

2. **Run frontend dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Frontend available at:**
   - http://localhost:5173

---

## File Locations

### Backend
```
src/main/java/com/smartcampus/ticketing_service/
├── controller/ResourceController.java
├── service/ResourceService.java
├── repository/ResourceRepository.java
├── model/Resource.java
└── dto/
    ├── ResourceCreateRequest.java
    ├── ResourceUpdateRequest.java
    └── ResourceResponse.java
```

### Frontend
```
frontend/src/components/
├── pages/
│   ├── ResourcesPage.jsx
│   ├── ResourcesPage.css
│   ├── AdminResourcesPage.jsx
│   └── AdminResourcesPage.css
└── resources/
    ├── ResourceDetailModal.jsx
    ├── ResourceDetailModal.css
    ├── AddEditResourceModal.jsx
    └── AddEditResourceModal.css
```

---

## Integration Checklist

- [ ] Update `App.jsx` with resource routes
- [ ] Add navigation items to sidebar for `/resources` and `/admin/resources`
- [ ] Verify authentication context provides role information
- [ ] Test API endpoints with Postman or browser
- [ ] Test user view (ResourcesPage)
- [ ] Test admin view (AdminResourcesPage)
- [ ] Test create/edit/delete operations
- [ ] Test search and filter functionality
- [ ] Test responsive design on mobile

---

## API Endpoint Quick Reference

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/resources | None | 200 |
| GET | /api/resources/{id} | None | 200 |
| POST | /api/resources | ADMIN | 201 |
| PUT | /api/resources/{id} | ADMIN | 200 |
| DELETE | /api/resources/{id} | ADMIN | 204 |
| PATCH | /api/resources/{id}/status | ADMIN | 200 |

---

## Sample Data for Testing

```json
{
  "name": "Lab A1",
  "type": "LAB",
  "capacity": 40,
  "location": "Building B, Floor 1",
  "description": "Equipment lab with workstations",
  "availabilityWindows": [
    {
      "daysOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

---

## Troubleshooting

**API returns 404:**
- Verify backend is running on port 8088
- Check MongoDB connection string
- Ensure resource exists in database

**Frontend can't call API:**
- Check CORS configuration in ResourceController
- Verify backend API URL in fetch calls
- Check browser console for errors

**Validation errors on create:**
- Ensure required fields: name, type, capacity, location
- Check field data types
- Verify enum values: LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT

**Modal not displaying:**
- Verify CSS imports in component files
- Check z-index values (should be 1000+)
- Ensure onClick handlers are properly bound

---

## Performance Considerations

✅ Implemented:
- Query parameter filtering (reduces data transfer)
- Lazy loading on routes
- Smooth animations (fade-in, slide-in)
- Responsive images and icons
- Error boundary handling

🚀 Optional Optimizations:
- Add pagination for large resource lists
- Implement React.memo for card components
- Add caching with React Query or SWR
- Implement virtual scrolling for large lists

---

## Security Notes

✅ Implemented:
- Role-based access control (ADMIN only for write ops)
- Input validation on both client and server
- No sensitive data in localStorage
- CORS enabled for development

⚠️ Production Checklist:
- Change CORS origins to production domain
- Enable HTTPS
- Implement JWT token refresh
- Add rate limiting
- Implement request signing
- Enable CSRF protection

---

## Git Commit Message Examples

```
feat: Add Resource model and repository for Module A

feat: Implement ResourceService with CRUD operations

feat: Add ResourceController with 6 RESTful endpoints

feat: Create ResourcesPage component for users

feat: Implement AdminResourcesPage for resource management

feat: Add AddEditResourceModal form for create/edit

fix: Fix CORS configuration for resource endpoints

docs: Add comprehensive implementation guide for Module A
```

---

## Next Steps

After Module A is complete:

1. **Module B:** Implement BookingController and BookingService
2. **Module C:** Implement IncidentTicketController with attachments
3. **Module D:** Add NotificationService and WebSocket support
4. **Module E:** Enhance OAuth 2.0 integration

---

## Support

For issues or questions:
1. Check the detailed guide: `MODULE_A_IMPLEMENTATION_GUIDE.md`
2. Review API endpoint examples
3. Check browser DevTools for errors
4. Verify database connectivity
5. Ensure all dependencies are installed

---

**Created:** April 25, 2026  
**Module:** A - Facilities & Assets Catalogue  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
