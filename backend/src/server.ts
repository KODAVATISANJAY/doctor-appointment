import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== IN-MEMORY DATA STORAGE ====================
let doctors: any[] = [];
let slots: any[] = [];
let appointments: any[] = [];

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ['https://doctor-appointment-navy-three.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// ==================== DOCTORS API ====================
// Create Doctor
app.post('/api/doctors', (req: Request, res: Response) => {
  try {
    const { name, specialization, email, phone, experience_years, clinic_name } = req.body;
    
    // Validation
    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({ error: 'Name, specialization, email, and phone are required' });
    }
    
    const newDoctor = {
      id: uuidv4(),
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
    res.status(201).json(newDoctor);
  } catch (error: any) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Doctors
app.get('/api/doctors', (req: Request, res: Response) => {
  try {
    console.log(`📋 Fetching ${doctors.length} doctors`);
    res.json(doctors);
  } catch (error: any) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor by ID
app.get('/api/doctors/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = doctors.find(d => d.id === id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error: any) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SLOTS API ====================
// Create Slot
app.post('/api/slots', (req: Request, res: Response) => {
  try {
    const { doctor_id, date, start_time } = req.body;
    
    // Validation
    if (!doctor_id || !date || !start_time) {
      return res.status(400).json({ error: 'doctor_id, date, and start_time are required' });
    }
    
    // Check if doctor exists
    const doctorExists = doctors.find(d => d.id === doctor_id);
    if (!doctorExists) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    const newSlot = {
      id: uuidv4(),
      doctor_id,
      date,
      start_time,
      is_available: true,
      created_at: new Date().toISOString()
    };
    
    slots.push(newSlot);
    console.log(`✅ Slot created for doctor ${doctor_id} on ${date} at ${start_time}`);
    res.status(201).json(newSlot);
  } catch (error: any) {
    console.error('Create slot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Available Slots
app.get('/api/slots', (req: Request, res: Response) => {
  try {
    const { doctor_id, date } = req.query;
    
    if (!doctor_id || !date) {
      return res.status(400).json({ error: 'doctor_id and date query parameters are required' });
    }
    
    const availableSlots = slots.filter(
      s => s.doctor_id === doctor_id && s.date === date && s.is_available === true
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    console.log(`📋 Found ${availableSlots.length} available slots`);
    res.json(availableSlots);
  } catch (error: any) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== APPOINTMENTS API ====================
// Book Appointment
app.post('/api/appointments/book', (req: Request, res: Response) => {
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
    
    // Check if slot exists and is available
    const slot = slots.find(
      s => s.doctor_id === doctor_id && 
           s.date === appointment_date && 
           s.start_time === appointment_time && 
           s.is_available === true
    );
    
    if (!slot) {
      return res.status(409).json({ error: 'Slot is not available' });
    }
    
    // Get doctor name
    const doctor = doctors.find(d => d.id === doctor_id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Mark slot as unavailable
    slot.is_available = false;
    
    // Create appointment
    const newAppointment = {
      id: uuidv4(),
      doctor_id,
      patient_name,
      patient_email,
      patient_phone,
      appointment_date,
      appointment_time,
      reason: reason || '',
      status: 'CONFIRMED',
      doctor_name: doctor.name,
      created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    console.log(`✅ Appointment booked for ${patient_name} with ${doctor.name}`);
    res.status(201).json(newAppointment);
  } catch (error: any) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Appointment by ID
app.get('/api/appointments/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = appointments.find(a => a.id === id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error: any) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Appointments
app.get('/api/appointments', (req: Request, res: Response) => {
  try {
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    console.log(`📋 Fetching ${sortedAppointments.length} appointments`);
    res.json(sortedAppointments);
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel Appointment
app.delete('/api/appointments/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const appointmentIndex = appointments.findIndex(a => a.id === id);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointments[appointmentIndex];
    
    // Release the slot
    const slot = slots.find(
      s => s.doctor_id === appointment.doctor_id && 
           s.date === appointment.appointment_date && 
           s.start_time === appointment.appointment_time
    );
    
    if (slot) {
      slot.is_available = true;
    }
    
    // Remove appointment
    appointments.splice(appointmentIndex, 1);
    
    console.log(`✅ Appointment ${id} cancelled`);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    doctors: doctors.length,
    slots: slots.length,
    appointments: appointments.length
  });
});

// ==================== 404 HANDLER ====================
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(' POST /api/doctors');
  console.log(' GET /api/doctors');
  console.log(' POST /api/slots');
  console.log(' GET /api/slots?doctor_id=X&date=YYYY-MM-DD');
  console.log(' POST /api/appointments/book');
  console.log(' GET /api/appointments');
  console.log(' DELETE /api/appointments/:id');
  console.log('');
});

export default app;
