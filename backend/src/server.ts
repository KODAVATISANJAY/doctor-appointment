import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ['https://doctor-appointment-navy-three.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// ==================== DOCTORS API ====================
// Create Doctor
app.post('/api/doctors', async (req: Request, res: Response) => {
  try {
    const { name, specialization, email, phone, experience_years, clinic_name } = req.body;
    
    // Validation
    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({ error: 'Name, specialization, email, and phone are required' });
    }
    
    const query = `
      INSERT INTO doctors (id, name, specialization, email, phone, experience_years, clinic_name, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, name, specialization, email, phone, experience_years, clinic_name, created_at
    `;
    
    const result = await pool.query(query, [
      uuidv4(),
      name,
      specialization,
      email,
      phone,
      experience_years || 0,
      clinic_name || ''
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Doctors
app.get('/api/doctors', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, specialization, email, phone, experience_years, clinic_name, created_at FROM doctors ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor by ID
app.get('/api/doctors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, specialization, email, phone, experience_years, clinic_name, created_at FROM doctors WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SLOTS API ====================
// Create Slots for Doctor
app.post('/api/slots', async (req: Request, res: Response) => {
  try {
    const { doctor_id, date, start_time } = req.body;
    
    // Validation
    if (!doctor_id || !date || !start_time) {
      return res.status(400).json({ error: 'doctor_id, date, and start_time are required' });
    }
    
    const query = `
      INSERT INTO slots (id, doctor_id, date, start_time, is_available, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
      RETURNING id, doctor_id, date, start_time, is_available, created_at
    `;
    
    const result = await pool.query(query, [
      uuidv4(),
      doctor_id,
      date,
      start_time
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Create slot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Available Slots
app.get('/api/slots', async (req: Request, res: Response) => {
  try {
    const { doctor_id, date } = req.query;
    
    if (!doctor_id || !date) {
      return res.status(400).json({ error: 'doctor_id and date query parameters are required' });
    }
    
    const query = `
      SELECT id, doctor_id, date, start_time, is_available, created_at
      FROM slots
      WHERE doctor_id = $1 AND date = $2 AND is_available = true
      ORDER BY start_time ASC
    `;
    
    const result = await pool.query(query, [doctor_id, date]);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== APPOINTMENTS API ====================
// Book Appointment (with transaction control)
app.post('/api/appointments/book', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const {
      doctor_id,
      patient_name,
      patient_email,
      patient_phone,
      appointment_date,
      appointment_time,
      reason
    } = req.body;
    
    // Validation
    if (!doctor_id || !patient_name || !patient_email || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if slot exists and is available
    const slotCheck = await client.query(
      `SELECT id FROM slots WHERE doctor_id = $1 AND date = $2 AND start_time = $3 AND is_available = true FOR UPDATE`,
      [doctor_id, appointment_date, appointment_time]
    );
    
    if (slotCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Slot is not available' });
    }
    
    const slotId = slotCheck.rows[0].id;
    
    // Mark slot as unavailable
    await client.query('UPDATE slots SET is_available = false WHERE id = $1', [slotId]);
    
    // Get doctor info
    const doctorResult = await client.query(
      'SELECT name FROM doctors WHERE id = $1',
      [doctor_id]
    );
    
    if (doctorResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    const doctor_name = doctorResult.rows[0].name;
    
    // Create appointment
    const appointmentQuery = `
      INSERT INTO appointments
      (id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status, doctor_name, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CONFIRMED', $9, NOW())
      RETURNING id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status, doctor_name, created_at
    `;
    
    const result = await client.query(appointmentQuery, [
      uuidv4(),
      doctor_id,
      patient_name,
      patient_email,
      patient_phone,
      appointment_date,
      appointment_time,
      reason || '',
      doctor_name
    ]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Book appointment error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get Appointment by ID
app.get('/api/appointments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status, doctor_name, created_at
      FROM appointments
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason, status, doctor_name, created_at
      FROM appointments
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel Appointment
app.delete('/api/appointments/:id', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Get appointment details
    const appointmentResult = await client.query(
      'SELECT doctor_id, appointment_date, appointment_time FROM appointments WHERE id = $1',
      [id]
    );
    
    if (appointmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointmentResult.rows[0];
    
    // Release the slot
    await client.query(
      'UPDATE slots SET is_available = true WHERE doctor_id = $1 AND date = $2 AND start_time = $3',
      [appointment.doctor_id, appointment.appointment_date, appointment.appointment_time]
    );
    
    // Delete appointment
    await client.query('DELETE FROM appointments WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== ERROR HANDLER ====================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// ==================== 404 HANDLER ====================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(' POST /api/doctors');
  console.log(' GET /api/doctors');
  console.log(' GET /api/doctors/:id');
  console.log(' POST /api/slots');
  console.log(' GET /api/slots?doctor_id=X&date=YYYY-MM-DD');
  console.log(' POST /api/appointments/book');
  console.log(' GET /api/appointments');
  console.log(' GET /api/appointments/:id');
  console.log(' DELETE /api/appointments/:id');
  console.log('');
});

export default app;
