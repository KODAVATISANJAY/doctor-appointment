import  { useState } from 'react'
function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([
    { id: 1, name: 'Dr. Smith', specialization: 'Cardiologist' },
    { id: 2, name: 'Dr. Johnson', specialization: 'Dentist' }
  ])
  const [appointments, setAppointments] = useState<any[]>([])

  return (
    <main>
      <section>
        <h2>Admin Dashboard</h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Doctors</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Specialization</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{doc.name}</td>
                  <td style={{ padding: '10px' }}>{doc.specialization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Recent Appointments</h3>
          {appointments.length === 0 ? (
            <p>No appointments yet</p>
          ) : (
            <ul>
              {appointments.map(apt => (
                <li key={apt.id}>{apt.patientName} - {apt.date}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard
