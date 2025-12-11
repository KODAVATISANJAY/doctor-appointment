# Backend Deployment Guide - Fix "Failed to Fetch" Error

## Problem

You're getting **"Error: Failed to fetch"** when trying to book an appointment because:
- The frontend is deployed on Vercel
- The backend API is NOT deployed anywhere
- The frontend tries to connect to `http://localhost:5000` which doesn't exist on production

## Solution: Deploy Backend on Render (Free Tier)

### Step 1: Prepare Backend for Production

1. Ensure your `backend/.env` has production values:
```
DATABASE_URL=postgresql://user:password@your-db-host:5432/doctor_appointment_db
PORT=5000
NODE_ENV=production
```

2. Check `backend/package.json` has:
```json
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc",
  "dev": "ts-node src/server.ts"
}
```

### Step 2: Deploy on Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** doctor-appointment-backend
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
5. Add Environment Variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `NODE_ENV` = production
   - `PORT` = 5000
6. Click "Create Web Service"

### Step 3: Get Your Backend URL

After deployment (takes ~5 minutes):
- Your backend URL will be: `https://doctor-appointment-backend.onrender.com`

### Step 4: Update Frontend Environment Variable

On Vercel:
1. Go to your Vercel project settings
2. Environment Variables
3. Add: `VITE_API_URL=https://doctor-appointment-backend.onrender.com`
4. Redeploy frontend

### Step 5: Update Your Code

The frontend code already uses:
```javascript
`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/book`
```

This means:
- **Local:** Uses `localhost:5000`
- **Production:** Uses environment variable

## Alternative: Deploy Backend on Railway

1. Go to https://railway.app
2. Connect GitHub
3. Create new project from repository
4. Select `backend` folder
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

## Testing the Fix

After backend is deployed:
1. Redeploy frontend (or just clear cache)
2. Go to your live app URL
3. Fill in booking form
4. Click "Book Appointment"
5. Should see success message instead of "Failed to fetch"

## Common Issues

### CORS Error
If you see CORS errors, add to `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'https://doctor-appointment-j2s9.vercel.app',
    'https://doctor-appointment-navy-three.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Database Connection
Make sure your PostgreSQL:
- Is accessible from the internet
- Has the correct connection string
- Has the schema created (run database/schema.sql)

## Next Steps

1. Deploy backend on Render or Railway
2. Get the backend URL
3. Add `VITE_API_URL` to Vercel environment variables
4. Redeploy frontend
5. Test the complete flow
