// In-memory data storage
let doctors = [];
let appointments = [];
let slots = [];

// Helper function to generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle different HTTP methods
export default function handler(req, res) {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all doctors
    return res.status(200).json(doctors);
  }

  if (req.method === 'POST') {
    // Create a new doctor
    const { name, specialization, email, phone, experience_years, clinic_name } = req.body;

    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newDoctor = {
      id: generateId(),
      name,
      specialization,
      email,
      phone,
      experience_years: experience_years || 0,
      clinic_name: clinic_name || '',
      created_at: new Date().toISOString()
    };

    doctors.push(newDoctor);
    console.log(`✅ Doctor created: ${name}`);
    return res.status(201).json(newDoctor);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
