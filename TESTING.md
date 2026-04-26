# Testing Guide

## Manual Testing

### User Registration
1. Navigate to /register
2. Enter valid email, password, and name
3. Submit form and verify account creation
4. Check email verification

### Appointment Booking
1. Login as a patient
2. Search for a doctor by specialization
3. Select available time slot
4. Confirm appointment and check notification

### Admin Dashboard
1. Login as admin
2. View all appointments
3. Manage doctor accounts
4. Generate reports

## API Testing
Use Postman or similar tools to test API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/doctors
- POST /api/appointments

## Running Tests
```bash
npm test
```
