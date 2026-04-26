# API Documentation

## Base URL
```
https://api.doctor-appointment.com
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user.
- Body: { email, password, name, role }
- Returns: JWT token

### POST /api/auth/login
Authenticate user.
- Body: { email, password }
- Returns: JWT token, user data

## Doctor Endpoints

### GET /api/doctors
Get all doctors with pagination.
- Query: ?page=1&limit=10&specialization=cardiology

### GET /api/doctors/:id
Get doctor by ID.

### POST /api/doctors
Create new doctor profile.

## Appointment Endpoints

### POST /api/appointments
Book an appointment.
- Body: { doctorId, date, time, notes }

### GET /api/appointments
Get user appointments.

### PUT /api/appointments/:id
Update appointment status.

### DELETE /api/appointments/:id
Cancel an appointment.
