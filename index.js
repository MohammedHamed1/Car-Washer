const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getConnector } = require('./config/db');
const FRONTEND_CONFIG = require('./frontend-config');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// CORS configuration for frontend
app.use(cors());

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to PayPass Backend API! 🚀',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      test: '/api/test',
      health: '/api/health',
      users: '/api/users',
      cars: '/api/cars',
      packages: '/api/packages',
      payments: '/api/payments'
    }
  });
});

// API Routes
app.use('/api', require('./routes/index'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/', '/api', '/api/test', '/api/health']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/test`);
}); 