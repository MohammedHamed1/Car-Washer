const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars FIRST
dotenv.config();

const { connectDB, getConnector } = require('./config/db');
const FRONTEND_CONFIG = require('./frontend-config');

// Load all models AFTER environment variables
// Core models (load first)
require('./modules/user/user.model');
require('./modules/car/car.model');
require('./modules/washingPlace/washingPlace.model');
require('./modules/package/package.model');

// Dependent models (load after core models)
require('./modules/package/userPackage.model');
require('./modules/wash/wash.model');
require('./modules/payment/payment.model');
require('./modules/feedback/feedback.model');
require('./modules/feedback/notification.model');
require('./modules/user/referral.model');

// Connect to DB
connectDB();

const app = express();

// CORS configuration for frontend
app.use(cors({
  origin: FRONTEND_CONFIG.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
      qr: {
        generate: '/api/qr/generate',
        scan: '/api/qr/scan',
        validate: '/api/qr/validate',
        status: '/api/qr/status/:orderId',
        use: '/api/qr/use'
      },
      dashboard: {
        stats: '/api/dashboard/stats',
        recentOrders: '/api/dashboard/recent-orders',
        liveTracking: '/api/dashboard/live-tracking',
        branchPerformance: '/api/dashboard/branch-performance',
        revenue: '/api/dashboard/revenue'
      },
      data: {
        users: {
          register: '/api/users/register',
          login: '/api/users/login',
          profile: '/api/users/profile',
          phoneSignup: '/api/users/phone-signup-initiate',
          phoneLogin: '/api/users/phone-login-initiate'
        },
        cars: '/api/cars',
        washingPlaces: '/api/washing-places',
        packages: '/api/packages',
        userPackages: '/api/user-packages',
        washes: '/api/washes',
        payments: '/api/payments',
        feedbacks: '/api/feedbacks'
      }
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
    availableRoutes: [
      // Basic routes
      '/',
      '/api',
      '/api/test',
      '/api/health',
      
      // QR routes
      '/api/qr/generate',
      '/api/qr/scan',
      '/api/qr/validate',
      '/api/qr/status/:orderId',
      '/api/qr/use',
      
      // Dashboard routes
      '/api/dashboard/stats',
      '/api/dashboard/recent-orders',
      '/api/dashboard/live-tracking',
      '/api/dashboard/branch-performance',
      '/api/dashboard/revenue',
      
      // Auth routes (Admin Dashboard)
      '/api/auth/login',
      '/api/auth/me',
      '/api/auth/logout',
      '/api/auth/refresh',
      
      // User routes (Authentication & Registration)
      '/api/users/register',
      '/api/users/login',
      '/api/users/profile',
      '/api/users/phone-signup-initiate',
      '/api/users/phone-signup-verify',
      '/api/users/phone-login-initiate',
      '/api/users/phone-login-verify',
      '/api/users/send-otp',
      '/api/users/verify-otp',
      '/api/users/referral-link',
      '/api/users/accept-referral',
      '/api/users/reward-referral',
      '/api/users/referral-status',
      '/api/users/barcodes',
      
      // Car routes
      '/api/cars',
      '/api/cars/:id',
      
      // Washing places routes
      '/api/washing-places',
      '/api/washing-places/nearest',
      '/api/washing-places/:id',
      '/api/washing-places/:id/feedbacks',
      
      // Package routes
      '/api/packages',
      '/api/packages/:id',
      '/api/packages/scan-info',
      '/api/packages/scan-qr',
      '/api/packages/start-wash',
      
      // User package routes
      '/api/user-packages',
      '/api/user-packages/active',
      '/api/user-packages/stats',
      '/api/user-packages/:id',
      '/api/user-packages/:id/use-wash',
      
      // Wash routes
      '/api/washes',
      '/api/washes/by-owner',
      '/api/washes/:id',
      '/api/washes/scan-barcode',
      
      // Payment routes
      '/api/payments',
      '/api/payments/:id',
      '/api/payments/hyperpay-checkout',
      '/api/payments/create-from-hyperpay',
      '/api/payments/create-tip-from-hyperpay',
      '/api/payments/result',
      
      // Feedback routes
      '/api/feedbacks',
      '/api/feedbacks/:id',
      '/api/feedbacks/washingPlace/:washingPlaceId',
      '/api/feedbacks/for-wash'
    ]
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