// Shared data storage across all requests (within same serverless execution)
let appointments = [];
let doctors = [];
let slots = [];

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default function handler(req, res) {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Fetch all appointments
  if (req.method === 'GET') {
    const sorted = [...appointments].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    return res.status(200).json(sorted);
  }

  // POST - Create appointment or book
  if (req.method === 'POST') {
    const { doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason } = req.body;

    if (!doctor_id || !patient_name || !patient_email || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAppointment = {
      id: generateId(),
      doctor_id,
      patient_name,
      patient_email,
      patient_phone,
      appointment_date,
      appointment_time,
      reason: reason || '',
      status: 'CONFIRMED',
      doctor_name: 'Dr. ' + (doctors.find(d => d.id === doctor_id)?.name || 'Unknown'),
      created_at: new Date().toISOString()
    };

    appointments.push(newAppointment);
    console.log(`✅ Appointment booked for ${patient_name}`);
    return res.status(201).json(newAppointment);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
