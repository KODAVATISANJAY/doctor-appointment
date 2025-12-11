# Doctor Appointment Frontend

## Overview
React + TypeScript frontend for the Doctor Appointment Booking System. Provides both admin and user interfaces for managing doctors, slots, and booking appointments.

## Technology Stack
- React 18
- TypeScript
- Vite (Fast build tool)
- React Router DOM (Navigation)
- Axios (HTTP client)
- Context API (State management)

## Features

### Admin Panel (`/admin`)
- Create new doctors with specialization
- Add appointment slots for doctors
- View all doctors and their details
- Manage slot availability

### User Interface
- Browse available doctors
- Search doctors by specialization and date
- Select available time slots
- Book appointments with real-time confirmation
- Track appointment status (PENDING/CONFIRMED/CANCELLED)

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.tsx      # Admin interface
│   ├── DoctorList.tsx           # Display doctors
│   ├── DoctorForm.tsx           # Create doctor form
│   ├── SlotForm.tsx             # Create slots form
│   ├── BookingPage.tsx          # Booking interface
│   ├── SlotSelector.tsx         # Slot selection UI
│   └── AppointmentStatus.tsx    # Status display
├── pages/
│   ├── AdminPage.tsx
│   ├── HomePage.tsx
│   └── BookingDetailPage.tsx
├── context/
│   └── AppContext.tsx           # Global state management
├── types/
│   └── index.ts                 # TypeScript interfaces
├── App.tsx                      # Main component
├── main.tsx                     # Entry point
└── index.css                    # Styles
```

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run dev
```

Server runs on `http://localhost:5173`

## Build

```bash
npm run build
```

## Environment Variables

Create `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Key Components

### AdminDashboard
Manage doctors and appointment slots. Admins can:
- Add new doctors
- Set available time slots
- View all doctors

### BookingPage
Allow users to:
- Select a doctor
- Choose appointment date
- Select from available time slots
- Book appointment
- View booking status

### AppContext
Manages global state using Context API:
- Doctors list
- Slots information
- Booking data
- User authentication state

## Routing

- `/` - Home (Doctor listing)
- `/admin` - Admin dashboard
- `/booking/:id` - Book appointment for doctor
- `/appointment/:id` - View appointment status

## API Integration

All API calls are made via Axios to backend endpoints:

- `GET /doctors` - Fetch all doctors
- `POST /doctors` - Create doctor
- `GET /slots?doctor_id=&date=` - Get available slots
- `POST /slots` - Create slots
- `POST /appointments/book` - Book appointment
- `GET /appointments/:id` - Get appointment status

## Error Handling

The application includes comprehensive error handling:
- API error messages
- Form validation errors
- Network failure handling
- User-friendly error notifications

## Performance

Optimizations implemented:
- React Router for code splitting
- Context API for state management (no unnecessary re-renders)
- Memoization of components
- Lazy loading of routes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (320px+)
