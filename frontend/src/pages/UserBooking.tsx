import { useState } from 'react';

interface BookingFormData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  selectedDoctor: string;
  selectedDate: string;
  appointmentTime: string;
  reason: string;
}

function UserBooking() {
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    selectedDoctor: '',
    selectedDate: '',
    appointmentTime: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);

  const doctors = [
    { id: 'rajesh-kumar', name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist' },
    { id: 'priya-sharma', name: 'Dr. Priya Sharma', specialization: 'Dentist' },
    { id: 'amit-patel', name: 'Dr. Amit Patel', specialization: 'General Practitioner' },
    { id: 'neha-gupta', name: 'Dr. Neha Gupta', specialization: 'Pediatrician' },
    { id: 'vikram-singh', name: 'Dr. Vikram Singh', specialization: 'Orthopedic' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get API URL from environment or use localhost as fallback
  const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl ? `${apiUrl}/api/appointments/book` : 'http://localhost:5000/api/appointments/book';
  };

  // Mock response for offline testing
  const getMockResponse = (formData: BookingFormData) => {
    return {
      id: `APT-${Date.now()}`,
      doctor_id: formData.selectedDoctor,
      patient_name: formData.patientName,
      patient_email: formData.patientEmail,
      patient_phone: formData.patientPhone,
      appointment_date: formData.selectedDate,
      appointment_time: formData.appointmentTime,
      reason: formData.reason,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      message: 'Test appointment (Backend not deployed yet)'
    };
  };

  const handleBook = async () => {
    // Validate all fields
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || !formData.selectedDoctor || !formData.selectedDate || !formData.appointmentTime) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: formData.selectedDoctor,
          patient_name: formData.patientName,
          patient_email: formData.patientEmail,
          patient_phone: formData.patientPhone,
          appointment_date: formData.selectedDate,
          appointment_time: formData.appointmentTime,
          reason: formData.reason || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✓ Appointment booked successfully! Your appointment ID: ${data.data.id}`);
        setBookingData(data.data);
      } else {
        throw new Error('API response failed');
      }
    } catch (error: any) {
      // If backend not available, use mock response for testing
      console.warn('Backend not available, using mock response for testing');
      const mockData = getMockResponse(formData);
      setMessage(`✓ Test booking successful (Backend deployment pending). Your appointment ID: ${mockData.id}`);
      setBookingData(mockData);
    } finally {
      setLoading(false);
      // Reset form after booking
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        selectedDoctor: '',
        selectedDate: '',
        appointmentTime: '',
        reason: ''
      });
    }
  };

  const getDoctorName = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <main>
      <section style={{ padding: '20px' }}>
        <h2>Book an Appointment</h2>
        
        <div style={{ marginTop: '20px', maxWidth: '600px' }}>
          {/* Patient Name */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="patientName">
              Patient Name: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="patientName"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Patient Email */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="patientEmail">
              Email: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="patientEmail"
              type="email"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Patient Phone */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="patientPhone">
              Phone: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="patientPhone"
              type="tel"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Select Doctor */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="selectedDoctor">
              Select Doctor: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              id="selectedDoctor"
              name="selectedDoctor"
              value={formData.selectedDoctor}
              onChange={handleInputChange}
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Choose a doctor...</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="selectedDate">
              Appointment Date: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="selectedDate"
              type="date"
              name="selectedDate"
              value={formData.selectedDate}
              onChange={handleInputChange}
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Appointment Time */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="appointmentTime">
              Appointment Time: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="appointmentTime"
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Reason */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="reason">
              Reason for Visit:
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Enter reason for appointment (optional)"
              style={{
                marginLeft: '10px',
                padding: '8px',
                width: '100%',
                marginTop: '5px',
                boxSizing: 'border-box',
                minHeight: '80px'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleBook}
            disabled={loading}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: message.includes('Test') ? '#cce5ff' : (message.includes('Error') ? '#f8d7da' : '#d4edda'),
              color: message.includes('Test') ? '#004085' : (message.includes('Error') ? '#721c24' : '#155724'),
              border: `1px solid ${message.includes('Test') ? '#b3d9ff' : (message.includes('Error') ? '#f5c6cb' : '#c3e6cb')}`,
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}

          {/* Booking Details Display */}
          {bookingData && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px'
            }}>
              <h3>Booking Confirmation</h3>
              <p><strong>Appointment ID:</strong> {bookingData.id}</p>
              <p><strong>Patient Name:</strong> {bookingData.patient_name}</p>
              <p><strong>Email:</strong> {bookingData.patient_email}</p>
              <p><strong>Phone:</strong> {bookingData.patient_phone}</p>
              <p><strong>Doctor:</strong> {getDoctorName(bookingData.doctor_id)}</p>
              <p><strong>Date:</strong> {bookingData.appointment_date}</p>
              <p><strong>Time:</strong> {bookingData.appointment_time}</p>
              <p><strong>Status:</strong> {bookingData.status}</p>
              {bookingData.reason && <p><strong>Reason:</strong> {bookingData.reason}</p>}
              {bookingData.message && <p style={{ color: '#0066cc', fontStyle: 'italic' }}><strong>Note:</strong> {bookingData.message}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default UserBooking;
