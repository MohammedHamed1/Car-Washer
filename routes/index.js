const express = require('express');
const router = express.Router();

// ========================================
// 📋 API Documentation & Status Endpoints
// ========================================

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'PayPass API is working! 🚀',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Health check route
router.get('/health', (req, res) => {
      res.json({
        success: true,
    status: 'healthy',
    server: 'running',
    database: 'connected',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
      res.json({
        success: true,
    message: 'PayPass API Documentation',
    version: '2.0.0',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
    endpoints: {
      // Authentication
      auth: {
        'POST /auth/login': 'Admin login',
        'GET /auth/me': 'Get current user (requires auth)',
        'POST /auth/logout': 'Logout (requires auth)',
        'POST /auth/refresh': 'Refresh token (requires auth)'
      },
      // Users
      users: {
        'POST /users/register': 'Register new user',
        'POST /users/login': 'User login',
        'GET /users/profile': 'Get user profile (requires auth)',
        'PUT /users/profile': 'Update user profile (requires auth)',
        'DELETE /users/profile': 'Delete user profile (requires auth)',
        'GET /users/barcodes': 'Get user packages (requires auth)',
        'GET /users/referral-link': 'Generate referral link (requires auth)',
        'POST /users/accept-referral': 'Accept referral (requires auth)',
        'POST /users/reward-referral': 'Reward referral (requires auth)',
        'POST /users/send-otp': 'Send OTP (requires auth)',
        'POST /users/verify-otp': 'Verify OTP (requires auth)',
        'GET /users/referral-status': 'Get referral status (requires auth)',
        'POST /users/phone-login-initiate': 'Phone login initiate',
        'POST /users/phone-login-verify': 'Phone login verify',
        'POST /users/phone-signup-initiate': 'Phone signup initiate',
        'POST /users/phone-signup-verify': 'Phone signup verify'
      },
      // Cars
      cars: {
        'POST /cars': 'Create car (requires auth)',
        'GET /cars': 'Get user cars (requires auth)',
        'GET /cars/:id': 'Get specific car (requires auth)',
        'PUT /cars/:id': 'Update car (requires auth)',
        'DELETE /cars/:id': 'Delete car (requires auth)',
        'GET /cars/sizes/available': 'Get available car sizes'
      },
      // Packages
      packages: {
        'POST /packages': 'Create package',
        'GET /packages': 'Get all packages',
        'GET /packages/:id': 'Get specific package',
        'PUT /packages/:id': 'Update package (requires auth)',
        'DELETE /packages/:id': 'Delete package (requires auth)',
        'POST /packages/scan-info': 'Scan package info (requires auth)',
        'POST /packages/scan-qr': 'Scan QR code (requires auth)',
        'POST /packages/start-wash': 'Start wash (requires auth)'
      },
      // User Packages
      userPackages: {
        'GET /user-packages': 'Get user packages (requires auth)',
        'GET /user-packages/active': 'Get active packages (requires auth)',
        'GET /user-packages/stats': 'Get package stats (requires auth)',
        'GET /user-packages/:id': 'Get specific package (requires auth)',
        'PUT /user-packages/:id': 'Update package (requires auth)',
        'POST /user-packages/:id/use-wash': 'Use wash (requires auth)',
        'POST /user-packages/buy': 'Buy package (requires auth)',
        'POST /user-packages': 'Create package (requires auth)',
        'GET /user-packages/by-user/:userId': 'Get packages by user ID',
        'GET /user-packages/test/:id': 'Test endpoint (no auth)',
        'GET /user-packages/debug/user-info': 'Debug user info (no auth)'
      },
      // Payments
      payments: {
        'POST /payments': 'Create payment (requires auth)',
        'GET /payments': 'Get user payments (requires auth)',
        'GET /payments/:id': 'Get specific payment (requires auth)',
        'PUT /payments/:id': 'Update payment (requires auth)',
        'DELETE /payments/:id': 'Delete payment (requires auth)',
        'POST /payments/hyperpay-checkout': 'HyperPay checkout (requires auth)',
        'POST /payments/create-from-hyperpay': 'Create from HyperPay (requires auth)',
        'POST /payments/create-tip-from-hyperpay': 'Create tip payment (requires auth)',
        'GET /payments/test-result': 'Test payment result',
        'GET /payments/result': 'HyperPay result handler'
      },
      // Washes
      washes: {
        'POST /washes': 'Create wash (requires auth)',
        'GET /washes': 'Get user washes (requires auth)',
        'GET /washes/by-owner': 'Get washes by owner (requires auth)',
        'GET /washes/:id': 'Get specific wash (requires auth)',
        'PUT /washes/:id': 'Update wash (requires auth)',
        'DELETE /washes/:id': 'Delete wash (requires auth)',
        'POST /washes/scan-barcode': 'Scan barcode and deduct wash'
      },
      // Washing Places
      washingPlaces: {
        'POST /washing-places': 'Create washing place',
        'GET /washing-places': 'Get all washing places',
        'GET /washing-places/nearest': 'Get nearest washing places',
        'GET /washing-places/:id': 'Get specific washing place',
        'PUT /washing-places/:id': 'Update washing place (requires auth)',
        'DELETE /washing-places/:id': 'Delete washing place (requires auth)',
        'GET /washing-places/:id/feedbacks': 'Get feedbacks for washing place'
      },
      // Feedbacks
      feedbacks: {
        'POST /feedbacks': 'Create feedback (requires auth)',
        'GET /feedbacks': 'Get all feedbacks',
        'GET /feedbacks/:id': 'Get specific feedback',
        'PUT /feedbacks/:id': 'Update feedback (requires auth)',
        'DELETE /feedbacks/:id': 'Delete feedback (requires auth)',
        'GET /feedbacks/washingPlace/:washingPlaceId': 'Get feedbacks for washing place',
        'POST /feedbacks/for-wash': 'Create feedback for wash (requires auth)'
      },
      // Referrals
      referrals: {
        'GET /referrals': 'Get user referrals (requires auth)',
        'GET /referrals/:id': 'Get specific referral (requires auth)',
        'POST /referrals': 'Create referral (requires auth)',
        'POST /referrals/:id/accept': 'Accept referral (requires auth)',
        'POST /referrals/:id/reward': 'Reward referral (requires auth)',
        'DELETE /referrals/:id': 'Delete referral (requires auth)'
      },
      // QR Code
      qr: {
        'POST /qr/generate': 'Generate QR code',
        'POST /qr/scan': 'Scan QR code',
        'POST /qr/validate': 'Validate QR code'
      },
      // Dashboard
      dashboard: {
        'GET /dashboard/stats': 'Get dashboard statistics',
        'GET /dashboard/recent-orders': 'Get recent orders'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Most endpoints require authentication except those marked as (no auth)'
    },
    responseFormat: {
      success: {
      success: true,
        message: 'Operation completed successfully',
        data: {}
      },
      error: {
      success: false,
        error: 'Error message',
        details: {}
        }
      }
    });
});

// ========================================
// 🔗 Route Registration
// ========================================

// تجميع جميع المسارات من modules
router.use('/users', require('../modules/user/user.routes'));
router.use('/cars', require('../modules/car/car.routes'));
router.use('/packages', require('../modules/package/package.routes'));
router.use('/user-packages', require('../modules/package/userPackage.routes'));
router.use('/payments', require('../modules/payment/payment.routes'));
router.use('/washes', require('../modules/wash/wash.routes'));
router.use('/washing-places', require('../modules/washingPlace/washingPlace.routes'));
router.use('/feedbacks', require('../modules/feedback/feedback.routes'));
router.use('/notifications', require('../modules/feedback/notification.routes'));
router.use('/referrals', require('../modules/user/referral.routes'));
router.use('/auth', require('./auth.routes'));

// ========================================
// 🔍 QR Code Routes
// ========================================

router.post('/qr/generate', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data is required' 
      });
    }
    
    // Generate QR code
    const qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrCode,
        originalData: data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/qr/scan', (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ 
        success: false,
        error: 'QR data is required' 
      });
    }
    
    res.json({
      success: true,
      message: 'QR code scanned successfully',
      data: {
        scannedData: qrData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/qr/validate', (req, res) => {
  try {
    const { qrCode } = req.body;
    if (!qrCode) {
      return res.status(400).json({ 
        success: false,
        error: 'QR code is required' 
      });
    }
    
    // Validate QR code
    const isValid = qrCode.startsWith('QR_');
    
    res.json({
      success: true,
      message: isValid ? 'QR code is valid' : 'QR code is invalid',
      data: {
        isValid,
        qrCode,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ========================================
// 📊 Dashboard Routes
// ========================================

router.get('/dashboard/stats', (req, res) => {
  try {
    // Mock data for dashboard stats
    const stats = {
      totalUsers: 1250,
      totalOrders: 3456,
      totalRevenue: 125000,
      activeOrders: 45,
      totalBranches: 8,
      totalPackages: 12,
      averageRating: 4.5,
      todayOrders: 23
    };
    
    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.get('/dashboard/recent-orders', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Mock recent orders data
    const recentOrders = Array.from({ length: limit }, (_, i) => ({
      _id: `order_${i + 1}`,
      orderNumber: `ORD${String(i + 1).padStart(4, '0')}`,
      customerName: `عميل ${i + 1}`,
      customerPhone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      customerAvatar: `https://via.placeholder.com/40`,
      branchName: `فرع ${Math.floor(Math.random() * 5) + 1}`,
      packageName: `باقة ${Math.floor(Math.random() * 3) + 1}`,
      totalAmount: Math.floor(Math.random() * 200) + 50,
      status: ['pending', 'in_progress', 'completed', 'ready_for_pickup'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: 'Recent orders retrieved successfully',
      data: { orders: recentOrders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========================================
// 🏠 Root Endpoint
// ========================================

router.get('/', (req, res) => {
    res.json({
      success: true,
    message: "PayPass API Root",
    version: "2.0.0",
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
    documentation: '/api/docs',
    test: '/api/test',
    health: '/api/health',
    availableRoutes: [
      'GET /api/docs - API Documentation',
      'GET /api/test - Test endpoint',
      'GET /api/health - Health check',
      'GET /api/users - User management',
      'GET /api/cars - Car management',
      'GET /api/packages - Package management',
      'GET /api/user-packages - User packages',
      'GET /api/payments - Payment management',
      'GET /api/washes - Wash management',
      'GET /api/washing-places - Washing places',
      'GET /api/feedbacks - Feedback management',
      'GET /api/referrals - Referral management',
      'GET /api/auth - Authentication',
      'POST /api/qr/generate - Generate QR code',
      'POST /api/qr/scan - Scan QR code',
      'POST /api/qr/validate - Validate QR code',
      'GET /api/dashboard/stats - Dashboard statistics',
      'GET /api/dashboard/recent-orders - Recent orders'
    ]
  });
});

module.exports = router;
