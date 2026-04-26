# Doctor Appointment System - Architecture

## System Overview
This project follows a full-stack architecture with separate frontend and backend services.

## Frontend Architecture
- React with Vite for fast development
- Component-based UI with reusable components
- State management with React Context API
- Responsive design with CSS modules

## Backend Architecture
- Node.js with Express.js REST API
- JWT-based authentication middleware
- MongoDB Atlas for data persistence
- API rate limiting and CORS configuration

## Database Schema
- Users collection (patients, doctors, admins)
- Appointments collection
- Doctors collection with specialization
- Admin logs and audit trail

## Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- MongoDB Atlas cloud database
- Environment variables managed securely
