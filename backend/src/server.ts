import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock auth middleware
app.use((req: any, res, next) => {
  req.user = { role: req.headers['x-user-role'] || 'user', id: uuidv4() };
  next();
});

// ==================== DOCTORS ENDPOINTS ====================

// Create Doctor
app.post('/api/doctors', async (req: Request, res: Response) => {
  try {
    const { name, specialization, email, phone, experience_years, bio, clinic_name } = req.body;

    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, email, phone, experience_years, bio, clinic_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, specialization, email, phone, experience_years || 0, bio || '', clinic_name || '']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Doctors
app.get('/api/doctors', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM doctors ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor by ID
app.get('/api/doctors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM doctors WHERE id = $1`, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SLOTS ENDPOINTS ====================

// Create Slots
app.post('/api/slots', async (req: Request, res: Response) => {
  try {
    const { doctor_id, date, times } = req.body;

    if (!doctor_id || !date || !times || times.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertedSlots = [];
    for (const time of times) {
      const result = await pool.query(
        `INSERT INTO slots (doctor_id, date, time, is_available)
         VALUES ($1, $2, $3, true)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [doctor_id, date, time]
      );
      if (result.rows.length > 0) {
        insertedSlots.push(result.rows[0]);
      }
    }

    res.status(201).json({ success: true, data: insertedSlots });
  } catch (error: any) {
    console.error('Create slots error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Available Slots
app.get('/api/slots', async (req: Request, res: Response) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({ error: 'doctor_id and date are required' });
    }

    const result = await pool.query(
      `SELECT * FROM slots
       WHERE doctor_id = $1 AND date = $2 AND is_available = true
       ORDER BY time ASC`,
      [doctor_id, date]
    );

    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== APPOINTMENTS ENDPOINTS ====================

// Book Appointment (with concurrency control)
app.post('/api/appointments/book', async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason } = req.body;

    if (!doctor_id || !patient_name || !patient_email || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start transaction with SERIALIZABLE isolation
    await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');

    // Check and lock the slot
    const slotResult = await client.query(
      `SELECT id FROM slots
       WHERE doctor_id = $1 AND date = $2 AND time = $3 AND is_available = true
       FOR UPDATE`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Slot not available' });
    }

    const slotId = slotResult.rows[0].id;

    // Mark slot as unavailable
    await client.query(
      `UPDATE slots SET is_available = false WHERE id = $1`,
      [slotId]
    );

    // Create appointment
    const appointmentResult = await client.query(
      `INSERT INTO appointments
       (doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, status, reason, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7, NOW() + INTERVAL '2 minutes')
       RETURNING *`,
      [doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason || '']
    );

    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: appointmentResult.rows[0],
      message: 'Appointment booked! Status: PENDING (expires in 2 minutes)'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Book appointment error:', error);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get Appointment Status
app.get('/api/appointments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Appointment
app.put('/api/appointments/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE appointments SET status = 'CONFIRMED', expires_at = NULL WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Appointment confirmed!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api/health`);
});
