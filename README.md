# Doctor Appointment Booking System

**A full-stack, production-ready doctor appointment booking platform with concurrent-safe booking and real-time slot management**

![Doctor Appointment System](https://img.shields.io/badge/Status-Active-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-16-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12-336791)

## 📋 Overview

A scalable doctor appointment booking system built with modern technologies. The system prevents overbooking through database-level transactions with SERIALIZABLE isolation and includes features like:

- **Concurrent-safe booking** with zero overbooking risk
- **Real-time slot management** for doctors
- **Admin dashboard** for doctor and slot management
- **User-friendly booking interface** with available slot visualization
- **Appointment status tracking** (PENDING → CONFIRMED/CANCELLED)
- **Auto-expiry mechanism** for pending bookings (2-minute timeout)
- **Responsive design** for mobile and desktop
- **RESTful API** with comprehensive documentation

## 🏗️ Project Structure

```
doctor-appointment/
├── backend/                    # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── server.ts          # Main Express server
│   │   └── ...
│   ├── database/
│   │   └── schema.sql         # Database schema with seed data
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
│
└── frontend/                   # React + TypeScript + Vite
    ├── src/
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── context/           # Context API for state
    │   ├── types/             # TypeScript types
    │   └── App.tsx
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .env
    ├── .gitignore
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup database
createb doctor_appointment_db
psql doctor_appointment_db < database/schema.sql

# Configure environment
# Edit .env with your database URL

# Build TypeScript
npm run build

# Start development server
npm run dev

# Or production
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit .env with backend API URL: VITE_API_URL=http://localhost:5000

# Start development server
npm run dev

# Or build for production
npm run build
```

Frontend runs on `http://localhost:5173`

## 🔑 Key Features

### Backend
✅ **Concurrency Control**: SERIALIZABLE isolation level transactions
✅ **RESTful APIs**: Complete doctor, slot, and appointment management
✅ **Database Schema**: Optimized PostgreSQL with indexes
✅ **Error Handling**: Comprehensive error responses
✅ **TypeScript**: Full type safety
✅ **Environment Config**: Secure .env configuration

### Frontend
✅ **Admin Dashboard**: Create/manage doctors and slots
✅ **User Interface**: Browse doctors and available slots
✅ **Booking System**: Visual slot selection and confirmation
✅ **Status Tracking**: Real-time appointment status
✅ **Error Handling**: User-friendly error messages
✅ **Responsive Design**: Works on mobile and desktop
✅ **Context API**: Centralized state management

## 📊 API Documentation

### Base URL
`http://localhost:5000/api`

### Doctors
- `POST /doctors` - Create doctor
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor details

### Slots
- `POST /slots` - Create appointment slots
- `GET /slots?doctor_id=&date=` - Get available slots

### Appointments
- `POST /appointments/book` - Book appointment
- `GET /appointments/:id` - Get appointment status
- `PUT /appointments/:id/confirm` - Confirm appointment
- `GET /appointments` - List all appointments

## 🔒 Concurrency Control

The system uses **SERIALIZABLE isolation level** with:
- Row-level locking (`SELECT ... FOR UPDATE`)
- Atomic transactions (all-or-nothing)
- Automatic rollback on conflicts

This ensures **zero overbooking** even under high concurrent load.

## 📚 Documentation

- Backend: See `backend/README.md` for detailed API documentation
- Frontend: See `frontend/README.md` for component structure and features
- Database: See `backend/database/schema.sql` for database design

## 🚢 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create Web Service on Render
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Connect PostgreSQL database

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory: `frontend`
4. Add environment variable: `VITE_API_URL`
5. Deploy

## 👨‍💼 Author

**KODAVATISANJAY**

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ⭐ Support

If you find this project helpful, please consider giving it a star ⭐

---

**Made with ❤️ for healthcare booking solutions**
