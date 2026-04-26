# Deployment Guide

## Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: npm run build
3. Set output directory: dist
4. Add environment variables for API URL
5. Deploy to production

## Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: npm install
4. Set start command: node server.js
5. Add environment variables for database and secrets

## Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Whitelist all IPs or specific IPs
3. Create database user with read/write permissions
4. Get connection string and add to environment variables

## Environment Variables
- MONGODB_URI
- JWT_SECRET
- PORT
- FRONTEND_URL
- NODE_ENV

## SSL/HTTPS
- Vercel provides automatic SSL
- Render provides automatic SSL for custom domains
