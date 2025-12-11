import { useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience_years: number;
  clinic_name: string;
}

interface Appointment {
  id: string;
  doctor_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  doctor_name: string;
  created_at: string;
}

function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    experience_years: 0,
    clinic_name: ''
  });
  
  const [slotForm, setSlotForm] = useState({
    doctor_id: '',
    date: '',
    start_time: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || ''/api'';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const doctorsRes = await fetch(`${apiUrl}/api/doctors`);
        if (!doctorsRes.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await doctorsRes.json();
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        
        const appointmentsRes = await fetch(`${apiUrl}/api/appointments`);
        if (!appointmentsRes.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await appointmentsRes.json();
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      });
      
      if (!response.ok) throw new Error('Failed to create doctor');
      
      const newDoctor = await response.json();
      setDoctors([...doctors, newDoctor]);
      setDoctorForm({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        experience_years: 0,
        clinic_name: ''
      });
      setShowDoctorForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create doctor');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotForm)
      });
      
      if (!response.ok) throw new Error('Failed to create slot');
      
      setSlotForm({
        doctor_id: '',
        date: '',
        start_time: ''
      });
      setShowSlotForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>{error}</div>}
      {loading && <div>Loading data...</div>}
      
      {!loading && (
        <>
          <div style={{ marginBottom: '30px' }}>
            <button onClick={() => setShowDoctorForm(!showDoctorForm)} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {showDoctorForm ? 'Cancel' : 'Add Doctor'}
            </button>
            
            {showDoctorForm && (
              <form onSubmit={handleCreateDoctor} style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                  <input type="text" required value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Specialization:</label>
                  <input type="text" required value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                  <input type="email" required value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
                  <input type="tel" required value={doctorForm.phone} onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Experience (years):</label>
                  <input type="number" required value={doctorForm.experience_years} onChange={(e) => setDoctorForm({...doctorForm, experience_years: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Clinic Name:</label>
                  <input type="text" required value={doctorForm.clinic_name} onChange={(e) => setDoctorForm({...doctorForm, clinic_name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Doctor</button>
              </form>
            )}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2>Doctors ({doctors.length})</h2>
            {doctors.length === 0 ? (
              <p>No doctors available</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {doctors.map((doctor) => (
                  <div key={doctor.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                    <h3>{doctor.name}</h3>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                    <p><strong>Experience:</strong> {doctor.experience_years} years</p>
                    <p><strong>Clinic:</strong> {doctor.clinic_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <button onClick={() => setShowSlotForm(!showSlotForm)} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {showSlotForm ? 'Cancel' : 'Create Appointment Slot'}
            </button>
            
            {showSlotForm && (
              <form onSubmit={handleCreateSlot} style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Select Doctor:</label>
                  <select required value={slotForm.doctor_id} onChange={(e) => setSlotForm({...slotForm, doctor_id: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
                  <input type="date" required value={slotForm.date} onChange={(e) => setSlotForm({...slotForm, date: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Start Time:</label>
                  <input type="time" required value={slotForm.start_time} onChange={(e) => setSlotForm({...slotForm, start_time: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Slot</button>
              </form>
            )}
          </div>

          <div>
            <h2>Recent Appointments ({appointments.length})</h2>
            {appointments.length === 0 ? (
              <p>No appointments yet</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Patient</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Doctor</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Date & Time</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Status</th>
                      <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 10).map((apt) => (
                      <tr key={apt.id}>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.patient_name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.doctor_name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.appointment_date} {apt.appointment_time}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.status}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
