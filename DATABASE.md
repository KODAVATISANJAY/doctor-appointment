# Database Documentation

## MongoDB Collections

### users
- _id: ObjectId
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (patient/doctor/admin)
- phone: String
- createdAt: Date

### doctors
- _id: ObjectId
- userId: ObjectId (ref: users)
- specialization: String
- experience: Number
- hospital: String
- availability: Array
- consultationFee: Number

### appointments
- _id: ObjectId
- patientId: ObjectId (ref: users)
- doctorId: ObjectId (ref: doctors)
- date: Date
- time: String
- status: String (pending/confirmed/cancelled)
- notes: String
- createdAt: Date

## Indexes
- email: unique index on users
- doctorId + date: compound index on appointments
- specialization: index on doctors
