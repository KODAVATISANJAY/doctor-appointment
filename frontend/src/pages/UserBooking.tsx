import React, { useState } from 'react'
function UserBooking() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate) {
      alert('Please select a doctor and date')
      return
    }
    // API call to book appointment
    console.log('Booking appointment for doctor:', selectedDoctor, 'on', selectedDate)
  }

  return (
    <main>
      <section>
        <h2>Book an Appointment</h2>
        <div style={{ marginTop: '20px' }}>
          <label>
            Select Doctor:
            <select 
              value={selectedDoctor} 
              onChange={(e) => setSelectedDoctor(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="">Choose a doctor...</option>
              <option value="1">Dr. Smith (Cardiologist)</option>
              <option value="2">Dr. Johnson (Dentist)</option>
            </select>
          </label>
          <label style={{ marginLeft: '20px' }}>
            Select Date:
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <button onClick={handleBook} style={{ marginLeft: '20px' }}>
            Book Appointment
          </button>
        </div>
      </section>
    </main>
  )
}

export default UserBooking
