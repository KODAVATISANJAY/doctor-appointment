# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Frontend fails to build
**Solution:** Run `npm install` first to ensure all dependencies are installed. Check Node.js version (v16+ required).

### Issue: Backend connection refused
**Solution:** Verify MongoDB connection string in .env file. Check if MongoDB Atlas IP whitelist includes your IP.

### Issue: CORS errors in browser
**Solution:** Ensure the frontend URL is added to the CORS allowed origins in the backend configuration.

### Issue: JWT token not working
**Solution:** Check if JWT_SECRET environment variable is set. Verify token expiration time.

### Issue: Port already in use
**Solution:** Kill the process using the port or change the PORT environment variable.

### Issue: Database connection timeout
**Solution:** Check MongoDB Atlas cluster status. Verify network connection and IP whitelist.
