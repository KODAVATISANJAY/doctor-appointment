// Shared data storage
let slots = [];
let doctors = [];

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

  // GET - Fetch available slots for a doctor on a specific date
  if (req.method === 'GET') {
    const { doctor_id, date } = req.query;
    
    if (!doctor_id || !date) {
      return res.status(400).json({ error: 'doctor_id and date are required' });
    }

    const availableSlots = slots.filter(
      s => s.doctor_id === doctor_id && s.date === date && s.is_available === true
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));

    return res.status(200).json(availableSlots);
  }

  // POST - Create new appointment slot
  if (req.method === 'POST') {
    const { doctor_id, date, start_time } = req.body;

    if (!doctor_id || !date || !start_time) {
      return res.status(400).json({ error: 'doctor_id, date, and start_time are required' });
    }

    const newSlot = {
      id: generateId(),
      doctor_id,
      date,
      start_time,
      is_available: true,
      created_at: new Date().toISOString()
    };

    slots.push(newSlot);
    console.log(`✅ Slot created for ${date} at ${start_time}`);
    return res.status(201).json(newSlot);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
