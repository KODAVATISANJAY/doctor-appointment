import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import UserBooking from './pages/UserBooking'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Doctor Appointment Booking System</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<UserBooking />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
