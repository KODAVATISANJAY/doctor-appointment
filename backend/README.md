# Doctor Appointment Booking System - Backend

## Overview
A scalable, concurrent-safe doctor appointment booking system built with Node.js, Express, and PostgreSQL. The system prevents overbooking through database transactions and handles multiple simultaneous booking requests.

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Concurrency Control**: Database transactions with SERIALIZABLE isolation level
- **Authentication**: Mock token-based (for demo)

## Features
✅ Doctor management (Create, Read, Update, Delete)
✅ Appointment slot management
✅ Concurrent-safe booking system
✅ Booking status tracking (PENDING, CONFIRMED, CANCELLED)
✅ Auto-expiry of PENDING bookings after 2 minutes
✅ RESTful API with proper error handling
✅ PostgreSQL with transaction-based concurrency control
✅ TypeScript for type safety

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection pool
│   ├── controllers/
│   │   ├── doctorController.ts  # Doctor CRUD operations
│   │   ├── appointmentController.ts # Appointment booking logic
│   │   └── slotController.ts    # Slot management
│   ├── routes/
│   │   ├── doctorRoutes.ts      # Doctor endpoints
│   │   ├── appointmentRoutes.ts # Appointment endpoints
│   │   └── slotRoutes.ts        # Slot endpoints
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── errorHandler.ts      # Error handling
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── concurrency.ts       # Transaction helpers
│   └── server.ts                # Main server file
├── database/
│   └── schema.sql               # Database schema
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/KODAVATISANJAY/doctor-appointment.git
cd doctor-appointment/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup PostgreSQL Database**
```bash
# Create database
createdb doctor_appointment_db

# Run schema
psql doctor_appointment_db < database/schema.sql
```

4. **Configure environment**
Update `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/doctor_appointment_db
PORT=5000
NODE_ENV=development
```

5. **Build TypeScript**
```bash
npm run build
```

6. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Doctors
- `POST /api/doctors` - Create a new doctor
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Slots
- `POST /api/slots` - Create appointment slots
- `GET /api/slots?doctor_id=&date=` - Get available slots

### Appointments
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/confirm` - Confirm appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments` - List all appointments

## Example API Usage

### 1. Create a Doctor
```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "specialization": "Cardiologist",
    "email": "john@example.com",
    "phone": "9876543210",
    "experience_years": 10,
    "bio": "Expert cardiologist with 10 years experience",
    "clinic_name": "City Heart Clinic"
  }'
```

### 2. Create Appointment Slots
```bash
curl -X POST http://localhost:5000/api/slots \
  -H "Content-Type: application/json" \
  -H "X-User-Role: admin" \
  -d '{
    "doctor_id": "uuid-of-doctor",
    "date": "2025-12-20",
    "times": ["09:00", "09:30", "10:00", "10:30"]
  }'
```

### 3. Book an Appointment
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "uuid-of-doctor",
    "patient_name": "John Patient",
    "patient_email": "patient@example.com",
    "patient_phone": "9876543211",
    "appointment_date": "2025-12-20",
    "appointment_time": "09:00",
    "reason": "Heart checkup"
  }'
```

## Concurrency Control Strategy

The system uses **SERIALIZABLE isolation level** transactions to prevent race conditions:

1. **Transaction-based Booking**: Each booking request runs in a SERIALIZABLE transaction
2. **Row-Level Locking**: Uses `SELECT ... FOR UPDATE` to lock slots
3. **Atomic Operations**: Booking and slot update happen atomically
4. **Rollback on Failure**: If any step fails, entire transaction rolls back

### How Overbooking is Prevented:
```typescript
BEGIN TRANSACTION (SERIALIZABLE)
  1. Lock the slot (SELECT ... FOR UPDATE)
  2. Check if slot is available
  3. If available:
     - Create appointment (PENDING status)
     - Mark slot as unavailable
     - Set 2-minute expiry
  4. COMMIT (all-or-nothing)
ON ERROR: ROLLBACK
```

## Database Schema

### Doctors Table
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  experience_years INT,
  bio TEXT,
  clinic_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Slots Table
```sql
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, date, time)
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns proper HTTP status codes:
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `409 Conflict` - Slot already booked
- `500 Internal Server Error` - Server error

## Testing the Concurrency

Run multiple simultaneous booking requests to test concurrency:
```bash
# Script to test concurrent bookings
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/appointments/book \
    -H "Content-Type: application/json" \
    -d '{...}' &
done
wait
```

Only ONE request should succeed; others should fail with "Slot not available" error.

## Production Deployment

### Render.com Deployment
1. Push code to GitHub
2. Create new Web Service on Render
3. Configure environment variables in dashboard
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Connect PostgreSQL database

## Performance Optimization

- Database indexing on frequently queried columns
- Connection pooling for database
- Prepared statements to prevent SQL injection
- Caching layer for doctor/slot listings (future)

## System Design Considerations

### Scalability
- Horizontal scaling with load balancer
- Read replicas for GET operations
- Separate read/write databases
- Redis caching for hot data

### High Concurrency
- Message queue (RabbitMQ/Kafka) for booking requests
- Async processing of confirmations
- WebSocket for real-time updates

## License
MIT

## Author
KODAVATISANJAY
