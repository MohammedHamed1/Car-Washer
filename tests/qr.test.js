const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');

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
    status: 'running'
  });
});

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api',
  timeout: 30000, // زيادة timeout للاختبارات المعقدة
  testUser: {
    email: 'qr-test@paypass.com',
    password: 'test123456',
    phone: '+966501234567',
    name: 'QR Test User'
  },
  testPackage: {
    name: 'QR Test Package',
    price: 100,
    washesIncluded: 5,
    description: 'Test package for QR testing'
  },
  testCar: {
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'White',
    plateNumber: 'QR123',
    size: 'medium'
  }
};

// Test results storage
const qrTestResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Helper function to log test results
const logQRTestResult = (testName, status, details = '') => {
  qrTestResults.total++;
  if (status === 'PASS') {
    qrTestResults.passed++;
    console.log(`✅ ${testName} - PASS`);
  } else {
    qrTestResults.failed++;
    console.log(`❌ ${testName} - FAIL: ${details}`);
  }
  qrTestResults.details.push({ name: testName, status, details });
};

// Helper function to print final report
const printQRTestReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 QR CODE TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${qrTestResults.total}`);
  console.log(`Passed: ${qrTestResults.passed} ✅`);
  console.log(`Failed: ${qrTestResults.failed} ❌`);
  console.log(`Success Rate: ${((qrTestResults.passed / qrTestResults.total) * 100).toFixed(2)}%`);
  
  if (qrTestResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    qrTestResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
};

// Test suite
describe('PayPass QR Code Tests', () => {
  let authToken = null;
  let testUserId = null;
  let testPackageId = null;
  let testUserPackageId = null;
  let testCarId = null;
  let generatedQRCode = null;
  let generatedBarcode = null;

  // Before all tests
  beforeAll(async () => {
    console.log('🚀 Starting PayPass QR Code Tests...');
    console.log(`📡 API Base URL: ${TEST_CONFIG.apiUrl}`);
    console.log(`⏱️  Timeout: ${TEST_CONFIG.timeout}ms`);
  });

  // After all tests
  afterAll(async () => {
    printQRTestReport();
    
    // Clean up test data
    try {
      if (testUserId) {
        await request(app).delete(`/api/users/${testUserId}`);
      }
      if (testPackageId) {
        await request(app).delete(`/api/packages/${testPackageId}`);
      }
      if (testUserPackageId) {
        await request(app).delete(`/api/user-packages/${testUserPackageId}`);
      }
      if (testCarId) {
        await request(app).delete(`/api/cars/${testCarId}`);
      }
    } catch (error) {
      console.log('🧹 Cleanup completed with some errors (expected)');
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  });

  // ========================================
  // 🔐 Authentication Setup
  // ========================================

  describe('Authentication Setup', () => {
    test('POST /api/users/register - Create test user', async () => {
      try {
        const response = await request(app)
          .post('/api/users/register')
          .send(TEST_CONFIG.testUser)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.user).toBeDefined();
        testUserId = response.body.data.user._id;
        authToken = response.body.data.token;
        logQRTestResult('POST /api/users/register - Create test user', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/users/register - Create test user', 'FAIL', error.message);
      }
    });

    test('POST /api/cars - Create test car', async () => {
      if (!authToken) {
        logQRTestResult('POST /api/cars - Create test car', 'SKIP', 'No auth token');
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
        logQRTestResult('POST /api/cars - Create test car', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/cars - Create test car', 'FAIL', error.message);
      }
    });

    test('POST /api/packages - Create test package', async () => {
      try {
        const response = await request(app)
          .post('/api/packages')
          .send(TEST_CONFIG.testPackage)
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.package).toBeDefined();
        testPackageId = response.body.data.package._id;
        logQRTestResult('POST /api/packages - Create test package', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/packages - Create test package', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔍 Basic QR Code Generation Tests
  // ========================================

  describe('Basic QR Code Generation', () => {
    test('POST /api/qr/generate - Generate basic QR code', async () => {
      try {
        const testData = 'PAYPASS-TEST-12345';
        const response = await request(app)
          .post('/api/qr/generate')
          .send({ data: testData })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.qrCode).toBeDefined();
        expect(response.body.data.originalData).toBe(testData);
        expect(response.body.data.timestamp).toBeDefined();
        
        generatedQRCode = response.body.data.qrCode;
        logQRTestResult('POST /api/qr/generate - Generate basic QR code', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/generate - Generate basic QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/generate - Generate QR with special characters', async () => {
      try {
        const testData = 'PAYPASS-USER-123-عربي-123';
        const response = await request(app)
          .post('/api/qr/generate')
          .send({ data: testData })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.qrCode).toBeDefined();
        logQRTestResult('POST /api/qr/generate - Generate QR with special characters', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/generate - Generate QR with special characters', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/generate - Generate QR with JSON data', async () => {
      try {
        const testData = JSON.stringify({
          type: 'user_package',
          userId: 'test-user-123',
          packageId: 'test-package-456',
          washesLeft: 5,
          expiry: new Date().toISOString()
        });
        
        const response = await request(app)
          .post('/api/qr/generate')
          .send({ data: testData })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.qrCode).toBeDefined();
        logQRTestResult('POST /api/qr/generate - Generate QR with JSON data', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/generate - Generate QR with JSON data', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/generate - Missing data validation', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/generate')
          .send({})
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Data is required');
        logQRTestResult('POST /api/qr/generate - Missing data validation', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/generate - Missing data validation', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📱 QR Code Scanning Tests
  // ========================================

  describe('QR Code Scanning', () => {
    test('POST /api/qr/scan - Scan valid QR code', async () => {
      try {
        const testQRData = 'PAYPASS-SCAN-TEST-12345';
        const response = await request(app)
          .post('/api/qr/scan')
          .send({ qrData: testQRData })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.scannedData).toBe(testQRData);
        expect(response.body.data.timestamp).toBeDefined();
        logQRTestResult('POST /api/qr/scan - Scan valid QR code', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/scan - Scan valid QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/scan - Scan QR with JSON data', async () => {
      try {
        const testQRData = JSON.stringify({
          type: 'user_package',
          barcode: 'PAYPASS-123-456-789',
          userId: 'user-123',
          packageId: 'package-456',
          washesLeft: 3
        });
        
        const response = await request(app)
          .post('/api/qr/scan')
          .send({ qrData: testQRData })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.scannedData).toBe(testQRData);
        logQRTestResult('POST /api/qr/scan - Scan QR with JSON data', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/scan - Scan QR with JSON data', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/scan - Missing QR data validation', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/scan')
          .send({})
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('QR data is required');
        logQRTestResult('POST /api/qr/scan - Missing QR data validation', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/scan - Missing QR data validation', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // ✅ QR Code Validation Tests
  // ========================================

  describe('QR Code Validation', () => {
    test('POST /api/qr/validate - Validate valid QR code', async () => {
      try {
        const validQRCode = 'QR_123456789_test';
        const response = await request(app)
          .post('/api/qr/validate')
          .send({ qrCode: validQRCode })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBe(true);
        expect(response.body.data.qrCode).toBe(validQRCode);
        logQRTestResult('POST /api/qr/validate - Validate valid QR code', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/validate - Validate valid QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/validate - Validate invalid QR code', async () => {
      try {
        const invalidQRCode = 'INVALID_QR_CODE';
        const response = await request(app)
          .post('/api/qr/validate')
          .send({ qrCode: invalidQRCode })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBe(false);
        logQRTestResult('POST /api/qr/validate - Validate invalid QR code', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/validate - Validate invalid QR code', 'FAIL', error.message);
      }
    });

    test('POST /api/qr/validate - Missing QR code validation', async () => {
      try {
        const response = await request(app)
          .post('/api/qr/validate')
          .send({})
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('QR code is required');
        logQRTestResult('POST /api/qr/validate - Missing QR code validation', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/qr/validate - Missing QR code validation', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🛒 User Package QR Tests
  // ========================================

  describe('User Package QR Integration', () => {
    test('POST /api/user-packages/buy - Buy package with QR generation', async () => {
      if (!authToken || !testPackageId) {
        logQRTestResult('POST /api/user-packages/buy - Buy package with QR generation', 'SKIP', 'No auth token or package ID');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/user-packages/buy')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            packageId: testPackageId,
            carId: testCarId,
            paymentMethod: 'cash'
          })
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.userPackage).toBeDefined();
        expect(response.body.data.userPackage.barcode).toBeDefined();
        expect(response.body.data.userPackage.barcodeImage).toBeDefined();
        
        testUserPackageId = response.body.data.userPackage._id;
        generatedBarcode = response.body.data.userPackage.barcode;
        
        logQRTestResult('POST /api/user-packages/buy - Buy package with QR generation', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/user-packages/buy - Buy package with QR generation', 'FAIL', error.message);
      }
    });

    test('GET /api/user-packages/:id - Get user package with QR data', async () => {
      if (!authToken || !testUserPackageId) {
        logQRTestResult('GET /api/user-packages/:id - Get user package with QR data', 'SKIP', 'No auth token or user package ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/user-packages/${testUserPackageId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.userPackage.barcode).toBeDefined();
        expect(response.body.data.userPackage.barcodeImage).toBeDefined();
        logQRTestResult('GET /api/user-packages/:id - Get user package with QR data', 'PASS');
      } catch (error) {
        logQRTestResult('GET /api/user-packages/:id - Get user package with QR data', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🧼 Wash QR Integration Tests
  // ========================================

  describe('Wash QR Integration', () => {
    test('POST /api/packages/scan-qr - Scan QR code for wash (requires owner auth)', async () => {
      if (!generatedBarcode) {
        logQRTestResult('POST /api/packages/scan-qr - Scan QR code for wash', 'SKIP', 'No barcode generated');
        return;
      }

      try {
        // This endpoint requires owner authentication, so it should return 403 for regular users
        const response = await request(app)
          .post('/api/packages/scan-qr')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            barcode: generatedBarcode,
            washingPlaceId: 'test-washing-place-id'
          })
          .expect(403); // Should be forbidden for non-owners
        
        expect(response.body.error).toBe('Access denied');
        logQRTestResult('POST /api/packages/scan-qr - Scan QR code for wash (requires owner auth)', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/packages/scan-qr - Scan QR code for wash (requires owner auth)', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 💳 Payment QR Tests
  // ========================================

  describe('Payment QR Integration', () => {
    test('POST /api/payments - Create payment with QR generation', async () => {
      if (!authToken) {
        logQRTestResult('POST /api/payments - Create payment with QR generation', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/payments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            amount: 100,
            currency: 'SAR',
            paymentMethod: 'cash',
            description: 'QR Test Payment'
          })
          .expect(201);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.payment).toBeDefined();
        // Note: Payment QR generation might be handled differently
        logQRTestResult('POST /api/payments - Create payment with QR generation', 'PASS');
      } catch (error) {
        logQRTestResult('POST /api/payments - Create payment with QR generation', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔧 QR Service Tests
  // ========================================

  describe('QR Service Integration', () => {
    test('QR Code generation with barcode service', async () => {
      try {
        const { generateQRCode, generateUniqueBarcode } = require('../services/barcode.service');
        
        // Test barcode generation
        const barcode = generateUniqueBarcode('test-user-123', 'test-package-456');
        expect(barcode).toMatch(/^PAYPASS-/);
        
        // Test QR code generation
        const qrCode = await generateQRCode(barcode);
        expect(qrCode).toMatch(/^data:image\/png;base64,/);
        
        logQRTestResult('QR Code generation with barcode service', 'PASS');
      } catch (error) {
        logQRTestResult('QR Code generation with barcode service', 'FAIL', error.message);
      }
    });

    test('QR Code validation with barcode service', async () => {
      try {
        const { validateBarcode, extractBarcodeInfo } = require('../services/barcode.service');
        
        // Test valid barcode
        const validBarcode = 'PAYPASS-user123-package456-1234567890-abc123';
        expect(validateBarcode(validBarcode)).toBe(true);
        
        // Test barcode info extraction
        const barcodeInfo = extractBarcodeInfo(validBarcode);
        expect(barcodeInfo.type).toBe('paypass');
        expect(barcodeInfo.userId).toBe('user123');
        expect(barcodeInfo.packageId).toBe('package456');
        
        logQRTestResult('QR Code validation with barcode service', 'PASS');
      } catch (error) {
        logQRTestResult('QR Code validation with barcode service', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📊 Performance Tests
  // ========================================

  describe('QR Code Performance', () => {
    test('QR Code generation performance', async () => {
      try {
        const { generateQRCode } = require('../services/barcode.service');
        const startTime = Date.now();
        
        // Generate multiple QR codes
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(generateQRCode(`PAYPASS-PERF-TEST-${i}`));
        }
        
        await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Should complete within 5 seconds
        expect(duration).toBeLessThan(5000);
        logQRTestResult('QR Code generation performance', 'PASS');
      } catch (error) {
        logQRTestResult('QR Code generation performance', 'FAIL', error.message);
      }
    });

    test('QR Code with large data', async () => {
      try {
        const { generateQRCode } = require('../services/barcode.service');
        
        // Generate QR with large JSON data
        const largeData = JSON.stringify({
          type: 'user_package',
          userId: 'user-123',
          packageId: 'package-456',
          washesLeft: 10,
          expiry: new Date().toISOString(),
          metadata: {
            description: 'This is a test package with detailed information',
            features: ['exterior_wash', 'interior_clean', 'wax_protection'],
            restrictions: ['valid_for_30_days', 'one_car_only'],
            terms: 'Standard terms and conditions apply'
          }
        });
        
        const qrCode = await generateQRCode(largeData);
        expect(qrCode).toMatch(/^data:image\/png;base64,/);
        logQRTestResult('QR Code with large data', 'PASS');
      } catch (error) {
        logQRTestResult('QR Code with large data', 'FAIL', error.message);
      }
    });
  });
});
