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
  const [error, setError] = useState<string>('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch doctors
        const doctorsResponse = await fetch(`${apiUrl}/api/doctors`);
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData.data || []);

        // Fetch appointments
        const appointmentsResponse = await fetch(`${apiUrl}/api/appointments`);
        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.data || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <main style={{ padding: '20px' }}>
      <section>
        <h2>Admin Dashboard</h2>

        {error && (
          <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading && <p>Loading data...</p>}

        {!loading && (
          <>
            <div style={{ marginTop: '20px' }}>
              <h3>Doctors ({doctors.length})</h3>
              {doctors.length === 0 ? (
                <p>No doctors available</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Specialization</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Phone</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Experience</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Clinic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{doc.name}</td>
                        <td style={{ padding: '10px' }}>{doc.specialization}</td>
                        <td style={{ padding: '10px' }}>{doc.email}</td>
                        <td style={{ padding: '10px' }}>{doc.phone}</td>
                        <td style={{ padding: '10px' }}>{doc.experience_years} years</td>
                        <td style={{ padding: '10px' }}>{doc.clinic_name || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ marginTop: '30px' }}>
              <h3>Recent Appointments ({appointments.length})</h3>
              {appointments.length === 0 ? (
                <p>No appointments yet</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Patient Name</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Doctor</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{apt.patient_name}</td>
                        <td style={{ padding: '10px' }}>{apt.doctor_name}</td>
                        <td style={{ padding: '10px' }}>{apt.appointment_date}</td>
                        <td style={{ padding: '10px' }}>{apt.appointment_time}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: apt.status === 'CONFIRMED' ? 'green' : 'orange' }}>
                          {apt.status}
                        </td>
                        <td style={{ padding: '10px' }}>{apt.patient_email}</td>
                        <td style={{ padding: '10px' }}>{apt.patient_phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
