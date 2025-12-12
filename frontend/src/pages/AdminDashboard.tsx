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
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    experience_years: 0,
    clinic_name: ''
  });

  const apiBase = '/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, appointmentsRes] = await Promise.all([
        fetch(`${apiBase}/doctors`),
        fetch(`${apiBase}/appointments`)
      ]);
      
      const doctorsData = await doctorsRes.json();
      const appointmentsData = await appointmentsRes.json();
      
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBase}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      });
      
      if (response.ok) {
        const newDoctor = await response.json();
        setDoctors([...doctors, newDoctor]);
        setDoctorForm({ name: '', specialization: '', email: '', phone: '', experience_years: 0, clinic_name: '' });
        setShowDoctorForm(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create doctor');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>{error}</div>}
      {loading && <div>Loading...</div>}
      
      {!loading && (
        <>
          <div style={{ marginBottom: '30px' }}>
            <button onClick={() => setShowDoctorForm(!showDoctorForm)} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {showDoctorForm ? 'Cancel' : 'Add Doctor'}
            </button>
            {showDoctorForm && (
              <form onSubmit={handleCreateDoctor} style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label>Name:</label>
                  <input type="text" value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Specialization:</label>
                  <input type="text" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Email:</label>
                  <input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Phone:</label>
                  <input type="tel" value={doctorForm.phone} onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create</button>
                 <div style={{ marginBottom: '15px' }}>
                 <label>Experience Years:</label>
                 <input type="number" value={doctorForm.experience_years} onChange={(e) => setDoctorForm({...doctorForm, experience_years: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                 </div>
                 <div style={{ marginBottom: '15px' }}>
                 <label>Clinic Name:</label>
                 <input type="text" value={doctorForm.clinic_name} onChange={(e) => setDoctorForm({...doctorForm, clinic_name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                 </div>
              </form>
            )}
          </div>

          <div>
            <h2>Doctors ({doctors.length})</h2>
            {doctors.length === 0 ? <p>No doctors</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {doctors.map((doc) => (
                  <div key={doc.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                    <h3>{doc.name}</h3>
                    <p><strong>Specialization:</strong> {doc.specialization}</p>
                    <p><strong>Email:</strong> {doc.email}</p>
                     <p><strong>Phone:</strong> {doc.phone}</p>
                 <p><strong>Experience Years:</strong> {doc.experience_years}</p>
                 <p><strong>Clinic Name:</strong> {doc.clinic_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '30px' }}>
            <h2>Appointments ({appointments.length})</h2>
            {appointments.length === 0 ? <p>No appointments</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Patient</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Doctor</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.patient_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.doctor_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{apt.appointment_date} {apt.appointment_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
