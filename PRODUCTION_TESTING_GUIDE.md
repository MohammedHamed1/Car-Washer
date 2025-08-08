# Production Testing Guide

## Updated Configuration

The following files have been updated to use the production server:

- ✅ `PayPass_Environment.json` - Updated `base_url` to `https://car-washer-production.up.railway.app/api`
- ✅ `test-all-endpoints.js` - Updated `API_BASE` to use production URL as default

## Running Tests

### Option 1: Using Newman (Postman CLI)

1. **Install Newman** (if not already installed):
   ```bash
   npm install -g newman
   ```

2. **Run the collection**:
   ```bash
   newman run PayPass_API_Collection.json -e PayPass_Environment.json
   ```

3. **Run with detailed output**:
   ```bash
   newman run PayPass_API_Collection.json -e PayPass_Environment.json --verbose
   ```

### Option 2: Using the Node.js Script

1. **Run the test script**:
   ```bash
   node test-all-endpoints.js
   ```

2. **Or use the npm script** (if added to package.json):
   ```bash
   npm run test:all-endpoints
   ```

## What's Being Tested

The tests will now run against the **production server** at:
`https://car-washer-production.up.railway.app/api`

### Test Coverage Includes:
- 🔐 Authentication (Register/Login)
- 🚗 Car Management
- 📦 Package Management  
- 💳 Payment Processing
- 💬 Feedback System
- 🔔 Notifications
- 👥 User Packages
- 🎯 Referrals

## Important Notes

⚠️ **Production Environment**: 
- All tests now run against the live production server
- Any data created during testing will be real data in the production database
- Payment tests will use real HyperPay credentials (be careful with actual transactions)

🔒 **Security**:
- Ensure your `.env` file contains the correct production credentials
- Don't commit sensitive data to version control
- Use environment variables for all sensitive configuration

## Troubleshooting

### Common Issues:

1. **Connection Timeout**:
   - Check if the production server is running
   - Verify the URL is correct: `https://car-washer-production.up.railway.app/api`

2. **Authentication Errors**:
   - Ensure the test user credentials are valid
   - Check if the JWT token is being generated correctly

3. **Payment Gateway Errors**:
   - Verify HyperPay credentials in `.env`
   - Check if the payment gateway is configured for production

### Getting Help:

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the production server is accessible
4. Review the logs for any server-side errors

## Quick Test Commands

```bash
# Test all endpoints
node test-all-endpoints.js

# Test with Newman
newman run PayPass_API_Collection.json -e PayPass_Environment.json

# Test specific module (if available)
npm run test:payment-gateway
```
