-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  experience_years INT DEFAULT 0,
  bio TEXT,
  clinic_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create slots table
CREATE TABLE IF NOT EXISTS slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, date, time)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   consultation_fee DECIMAL(10,2) DEFAULT 0.00
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_slots_doctor_date ON slots(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_expires_at ON appointments(expires_at);

-- Seed sample doctors
INSERT INTO doctors (name, specialization, email, phone, experience_years, bio, clinic_name) VALUES
('Dr. Rajesh Kumar', 'Cardiologist', 'rajesh@doctors.com', '9876543210', 12, 'Expert cardiologist with 12 years experience', 'City Heart Clinic'),
('Dr. Priya Sharma', 'Dentist', 'priya@doctors.com', '9876543211', 8, 'Specialized in cosmetic dentistry', 'Smile Care Dental'),
('Dr. Amit Patel', 'General Practitioner', 'amit@doctors.com', '9876543212', 15, 'General health specialist', 'Health First Clinic'),
('Dr. Neha Gupta', 'Pediatrician', 'neha@doctors.com', '9876543213', 6, 'Child healthcare specialist', 'Kids Care Center'),
('Dr. Vikram Singh', 'Orthopedic', 'vikram@doctors.com', '9876543214', 10, 'Bone and joint specialist', 'Ortho Care Hospital')
ON CONFLICT DO NOTHING;
