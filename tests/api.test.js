const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { API_CONFIG } = require('../config/api');

// Create Express app for testing
const app = express();

// Load environment variables
require('dotenv').config();

// Load all models before testing
require('../models/user.model');
require('../models/car.model');
require('../models/washingPlace.model');
require('../models/package.model');
require('../models/userPackage.model');
require('../models/wash.model');
require('../models/payment.model');
require('../models/feedback.model');
require('../models/notification.model');
require('../models/referral.model');

// Middleware
app.use(express.json());

// Load routes
const routes = require('../routes');
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to PayPass Backend API! 🚀',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      docs: '/api/docs',
      test: '/api/test',
      health: '/api/health'
    }
  });
});

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api',
  timeout: 10000,
  testUser: {
    email: 'test@paypass.com',
    password: 'test123456',
    phone: '+966501234567',
    name: 'Test User'
  },
  testCar: {
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'White',
    plateNumber: 'ABC123',
    size: 'medium'
  },
  testPackage: {
    name: 'Test Package',
    price: 100,
    washesIncluded: 5,
    description: 'Test package for API testing'
  }
};

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Helper function to log test results
const logTestResult = (testName, status, details = '') => {
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName} - PASS`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - FAIL: ${details}`);
  }
  testResults.details.push({ name: testName, status, details });
};

// Helper function to print final report
const printTestReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('📊 API TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
};

// Test suite
describe('PayPass API Tests', () => {
  let authToken = null;
  let testUserId = null;
  let testCarId = null;
  let testPackageId = null;
  let testUserPackageId = null;

  // Before all tests
  beforeAll(async () => {
    console.log('🚀 Starting PayPass API Tests...');
    console.log(`📡 API Base URL: ${TEST_CONFIG.apiUrl}`);
    console.log(`⏱️  Timeout: ${TEST_CONFIG.timeout}ms`);
  });

  // After all tests
  afterAll(async () => {
    printTestReport();
    
    // Clean up test data
    try {
      if (testUserId) {
        await request(app).delete(`/api/users/${testUserId}`);
      }
      if (testCarId) {
        await request(app).delete(`/api/cars/${testCarId}`);
      }
      if (testPackageId) {
        await request(app).delete(`/api/packages/${testPackageId}`);
      }
      if (testUserPackageId) {
        await request(app).delete(`/api/user-packages/${testUserPackageId}`);
      }
    } catch (error) {
      console.log('🧹 Cleanup completed with some errors (expected)');
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  });

  // ========================================
  // 🔍 System & Documentation Tests
  // ========================================

  describe('System Endpoints', () => {
    test('GET / - Root endpoint', async () => {
      try {
        const response = await request(app)
          .get('/')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Welcome');
        logTestResult('GET / - Root endpoint', 'PASS');
      } catch (error) {
        logTestResult('GET / - Root endpoint', 'FAIL', error.message);
      }
    });

    test('GET /api - API root endpoint', async () => {
      try {
        const response = await request(app)
          .get('/api')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.availableRoutes).toBeDefined();
        logTestResult('GET /api - API root endpoint', 'PASS');
      } catch (error) {
        logTestResult('GET /api - API root endpoint', 'FAIL', error.message);
      }
    });

    test('GET /api/test - Test endpoint', async () => {
      try {
        const response = await request(app)
          .get('/api/test')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('working');
        logTestResult('GET /api/test - Test endpoint', 'PASS');
      } catch (error) {
        logTestResult('GET /api/test - Test endpoint', 'FAIL', error.message);
      }
    });

    test('GET /api/health - Health check', async () => {
      try {
        const response = await request(app)
          .get('/api/health')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.status).toBe('healthy');
        logTestResult('GET /api/health - Health check', 'PASS');
      } catch (error) {
        logTestResult('GET /api/health - Health check', 'FAIL', error.message);
      }
    });

    test('GET /api/docs - API documentation', async () => {
      try {
        const response = await request(app)
          .get('/api/docs')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.endpoints).toBeDefined();
        logTestResult('GET /api/docs - API documentation', 'PASS');
      } catch (error) {
        logTestResult('GET /api/docs - API documentation', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔐 Authentication Tests
  // ========================================

  describe('Authentication Endpoints', () => {
    test('POST /api/users/register - User registration', async () => {
      try {
        const response = await request(app)
          .post('/api/users/register')
          .send(TEST_CONFIG.testUser)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.user).toBeDefined();
        testUserId = response.body.data.user._id;
        authToken = response.body.data.token;
        logTestResult('POST /api/users/register - User registration', 'PASS');
      } catch (error) {
        logTestResult('POST /api/users/register - User registration', 'FAIL', error.message);
      }
    });

    test('POST /api/users/login - User login', async () => {
      try {
        const response = await request(app)
          .post('/api/users/login')
          .send({
            email: TEST_CONFIG.testUser.email,
            password: TEST_CONFIG.testUser.password
          })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
        logTestResult('POST /api/users/login - User login', 'PASS');
      } catch (error) {
        logTestResult('POST /api/users/login - User login', 'FAIL', error.message);
      }
    });

    test('GET /api/users/profile - Get user profile (with auth)', async () => {
      if (!authToken) {
        logTestResult('GET /api/users/profile - Get user profile', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.user).toBeDefined();
        logTestResult('GET /api/users/profile - Get user profile', 'PASS');
      } catch (error) {
        logTestResult('GET /api/users/profile - Get user profile', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🚗 Car Management Tests
  // ========================================

  describe('Car Management Endpoints', () => {
    test('POST /api/cars - Create car', async () => {
      if (!authToken) {
        logTestResult('POST /api/cars - Create car', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/cars')
          .set('Authorization', `Bearer ${authToken}`)
          .send(TEST_CONFIG.testCar)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.car).toBeDefined();
        testCarId = response.body.data.car._id;
        logTestResult('POST /api/cars - Create car', 'PASS');
      } catch (error) {
        logTestResult('POST /api/cars - Create car', 'FAIL', error.message);
      }
    });

    test('GET /api/cars - Get user cars', async () => {
      if (!authToken) {
        logTestResult('GET /api/cars - Get user cars', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/cars')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.cars)).toBe(true);
        logTestResult('GET /api/cars - Get user cars', 'PASS');
      } catch (error) {
        logTestResult('GET /api/cars - Get user cars', 'FAIL', error.message);
      }
    });

    test('GET /api/cars/sizes/available - Get available car sizes', async () => {
      try {
        const response = await request(app)
          .get('/api/cars/sizes/available')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.sizes)).toBe(true);
        logTestResult('GET /api/cars/sizes/available - Get available car sizes', 'PASS');
      } catch (error) {
        logTestResult('GET /api/cars/sizes/available - Get available car sizes', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📦 Package Management Tests
  // ========================================

  describe('Package Management Endpoints', () => {
    test('POST /api/packages - Create package', async () => {
      try {
        const response = await request(app)
          .post('/api/packages')
          .send(TEST_CONFIG.testPackage)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.package).toBeDefined();
        testPackageId = response.body.data.package._id;
        logTestResult('POST /api/packages - Create package', 'PASS');
      } catch (error) {
        logTestResult('POST /api/packages - Create package', 'FAIL', error.message);
      }
    });

    test('GET /api/packages - Get all packages', async () => {
      try {
        const response = await request(app)
          .get('/api/packages')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.packages)).toBe(true);
        logTestResult('GET /api/packages - Get all packages', 'PASS');
      } catch (error) {
        logTestResult('GET /api/packages - Get all packages', 'FAIL', error.message);
      }
    });

    test('GET /api/packages/:id - Get specific package', async () => {
      if (!testPackageId) {
        logTestResult('GET /api/packages/:id - Get specific package', 'SKIP', 'No package ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/packages/${testPackageId}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.package).toBeDefined();
        logTestResult('GET /api/packages/:id - Get specific package', 'PASS');
      } catch (error) {
        logTestResult('GET /api/packages/:id - Get specific package', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🛒 User Package Tests
  // ========================================

  describe('User Package Endpoints', () => {
    test('POST /api/user-packages/buy - Buy package', async () => {
      if (!authToken || !testPackageId) {
        logTestResult('POST /api/user-packages/buy - Buy package', 'SKIP', 'No auth token or package ID');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/user-packages/buy')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            packageId: testPackageId,
            paymentMethod: 'cash'
          })
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.userPackage).toBeDefined();
        testUserPackageId = response.body.data.userPackage._id;
        logTestResult('POST /api/user-packages/buy - Buy package', 'PASS');
      } catch (error) {
        logTestResult('POST /api/user-packages/buy - Buy package', 'FAIL', error.message);
      }
    });

    test('GET /api/user-packages - Get user packages', async () => {
      if (!authToken) {
        logTestResult('GET /api/user-packages - Get user packages', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/user-packages')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.userPackages)).toBe(true);
        logTestResult('GET /api/user-packages - Get user packages', 'PASS');
      } catch (error) {
        logTestResult('GET /api/user-packages - Get user packages', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🏢 Washing Places Tests
  // ========================================

  describe('Washing Places Endpoints', () => {
    test('GET /api/washing-places - Get all washing places', async () => {
      try {
        const response = await request(app)
          .get('/api/washing-places')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.washingPlaces)).toBe(true);
        logTestResult('GET /api/washing-places - Get all washing places', 'PASS');
      } catch (error) {
        logTestResult('GET /api/washing-places - Get all washing places', 'FAIL', error.message);
      }
    });

    test('GET /api/washing-places/nearest - Get nearest washing places', async () => {
      try {
        const response = await request(app)
          .get('/api/washing-places/nearest')
          .query({
            latitude: 24.7136,
            longitude: 46.6753,
            radius: 10
          })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.washingPlaces)).toBe(true);
        logTestResult('GET /api/washing-places/nearest - Get nearest washing places', 'PASS');
      } catch (error) {
        logTestResult('GET /api/washing-places/nearest - Get nearest washing places', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 💳 Payment Tests
  // ========================================

  describe('Payment Endpoints', () => {
    test('GET /api/payments - Get user payments', async () => {
      if (!authToken) {
        logTestResult('GET /api/payments - Get user payments', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/payments')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.payments)).toBe(true);
        logTestResult('GET /api/payments - Get user payments', 'PASS');
      } catch (error) {
        logTestResult('GET /api/payments - Get user payments', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🧼 Wash Tests
  // ========================================

  describe('Wash Endpoints', () => {
    test('GET /api/washes - Get user washes', async () => {
      if (!authToken) {
        logTestResult('GET /api/washes - Get user washes', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/washes')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.washes)).toBe(true);
        logTestResult('GET /api/washes - Get user washes', 'PASS');
      } catch (error) {
        logTestResult('GET /api/washes - Get user washes', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📝 Feedback Tests
  // ========================================

  describe('Feedback Endpoints', () => {
    test('GET /api/feedbacks - Get all feedbacks', async () => {
      try {
        const response = await request(app)
          .get('/api/feedbacks')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.feedbacks)).toBe(true);
        logTestResult('GET /api/feedbacks - Get all feedbacks', 'PASS');
      } catch (error) {
        logTestResult('GET /api/feedbacks - Get all feedbacks', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔗 Referral Tests
  // ========================================

  describe('Referral Endpoints', () => {
    test('GET /api/referrals - Get user referrals', async () => {
      if (!authToken) {
        logTestResult('GET /api/referrals - Get user referrals', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/referrals')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.referrals)).toBe(true);
        logTestResult('GET /api/referrals - Get user referrals', 'PASS');
      } catch (error) {
        logTestResult('GET /api/referrals - Get user referrals', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📊 Dashboard Tests
  // ========================================

  describe('Dashboard Endpoints', () => {
    test('GET /api/dashboard/stats - Get dashboard stats', async () => {
      try {
        const response = await request(app)
          .get('/api/dashboard/stats')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        logTestResult('GET /api/dashboard/stats - Get dashboard stats', 'PASS');
      } catch (error) {
        logTestResult('GET /api/dashboard/stats - Get dashboard stats', 'FAIL', error.message);
      }
    });

    test('GET /api/dashboard/recent-orders - Get recent orders', async () => {
      try {
        const response = await request(app)
          .get('/api/dashboard/recent-orders')
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.orders).toBeDefined();
        logTestResult('GET /api/dashboard/recent-orders - Get recent orders', 'PASS');
      } catch (error) {
        logTestResult('GET /api/dashboard/recent-orders - Get recent orders', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔍 QR Code Tests
  // ========================================

  describe('QR Code Endpoints', () => {
    test('POST /api/qr/generate - Generate QR code', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/generate')
          .send({ data: 'test-qr-data' })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.qrCode).toBeDefined();
        logTestResult('POST /api/qr/generate - Generate QR code', 'PASS');
      } catch (error) {
        logTestResult('POST /api/qr/generate - Generate QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/scan - Scan QR code', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/scan')
          .send({ qrData: 'test-qr-data' })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.scannedData).toBeDefined();
        logTestResult('POST /api/qr/scan - Scan QR code', 'PASS');
      } catch (error) {
        logTestResult('POST /api/qr/scan - Scan QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/validate - Validate QR code', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/validate')
          .send({ qrCode: 'QR_123456789_test' })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBeDefined();
        logTestResult('POST /api/qr/validate - Validate QR code', 'PASS');
      } catch (error) {
        logTestResult('POST /api/qr/validate - Validate QR code', 'FAIL', error.message);
      }
    });
  });
});
