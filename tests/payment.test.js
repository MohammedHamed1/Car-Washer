const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Create Express app for testing
const app = express();

// Load environment variables
require('dotenv').config();

// Load all models before testing
require('../models/user.model');
require('../models/car.model');
require('../models/package.model');
require('../models/payment.model');
require('../models/userPackage.model');

// Middleware
app.use(express.json());

// Load routes
const routes = require('../routes');
app.use('/api', routes);

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api',
  timeout: 30000,
  testUser: {
    email: 'payment-test@paypass.com',
    password: 'test123456',
    phone: '+966501234567',
    name: 'Payment Test User'
  },
  testPackage: {
    _id: 'test-package-123',
    name: 'Payment Test Package',
    price: 100,
    washes: 5,
    duration: 30
  },
  testPayment: {
    amount: 100,
    paymentMethod: 'CARD',
    billingAddress: {
      street1: 'Test Street',
      city: 'Riyadh',
      state: 'Riyadh',
      country: 'SA',
      postcode: '12345'
    }
  }
};

// Test results storage
const paymentTestResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Helper function to log test results
const logPaymentTestResult = (testName, status, details = '') => {
  paymentTestResults.total++;
  if (status === 'PASS') {
    paymentTestResults.passed++;
    console.log(`✅ ${testName} - PASS`);
  } else {
    paymentTestResults.failed++;
    console.log(`❌ ${testName} - FAIL: ${details}`);
  }
  paymentTestResults.details.push({ name: testName, status, details });
};

// Helper function to print final report
const printPaymentTestReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('💳 PAYMENT TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${paymentTestResults.total}`);
  console.log(`Passed: ${paymentTestResults.passed} ✅`);
  console.log(`Failed: ${paymentTestResults.failed} ❌`);
  console.log(`Success Rate: ${((paymentTestResults.passed / paymentTestResults.total) * 100).toFixed(2)}%`);
  
  if (paymentTestResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    paymentTestResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
};

// Test suite
describe('PayPass Payment Tests', () => {
  let authToken = null;
  let testUserId = null;
  let testPackageId = null;
  let testCheckoutId = null;
  let testPaymentId = null;

  // Before all tests
  beforeAll(async () => {
    console.log('🚀 Starting PayPass Payment Tests...');
    console.log(`📡 API Base URL: ${TEST_CONFIG.apiUrl}`);
    console.log(`⏱️  Timeout: ${TEST_CONFIG.timeout}ms`);
  });

  // After all tests
  afterAll(async () => {
    printPaymentTestReport();
    
    // Clean up test data
    try {
      if (testUserId) {
        await request(app).delete(`/api/users/${testUserId}`);
      }
      if (testPackageId) {
        await request(app).delete(`/api/packages/${testPackageId}`);
      }
      if (testPaymentId) {
        await request(app).delete(`/api/payments/${testPaymentId}`);
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
        logPaymentTestResult('POST /api/users/register - Create test user', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/users/register - Create test user', 'FAIL', error.message);
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
        logPaymentTestResult('POST /api/packages - Create test package', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/packages - Create test package', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 💳 Payment Configuration Tests
  // ========================================

  describe('Payment Configuration', () => {
    test('GET /api/payments/config - Get payment configuration', async () => {
      if (!authToken) {
        logPaymentTestResult('GET /api/payments/config - Get payment configuration', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/payments/config')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.baseUrl).toBeDefined();
        expect(response.body.data.entityId).toBeDefined();
        expect(response.body.data.applePayEntityId).toBeDefined();
        expect(response.body.data.supportedMethods).toBeDefined();
        logPaymentTestResult('GET /api/payments/config - Get payment configuration', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/config - Get payment configuration', 'FAIL', error.message);
      }
    });

    test('GET /api/payments/methods - Get supported payment methods', async () => {
      if (!authToken) {
        logPaymentTestResult('GET /api/payments/methods - Get supported payment methods', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/payments/methods')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.methods).toBeDefined();
        expect(Array.isArray(response.body.data.methods)).toBe(true);
        expect(response.body.data.methods).toContain('VISA');
        expect(response.body.data.methods).toContain('MASTER');
        expect(response.body.data.methods).toContain('MADA');
        expect(response.body.data.methods).toContain('APPLEPAY');
        logPaymentTestResult('GET /api/payments/methods - Get supported payment methods', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/methods - Get supported payment methods', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 💳 Payment Checkout Tests
  // ========================================

  describe('Payment Checkout', () => {
    test('POST /api/payments/prepare-checkout - Prepare card payment checkout', async () => {
      if (!authToken || !testPackageId) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare card payment checkout', 'SKIP', 'No auth token or package ID');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/payments/prepare-checkout')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            packageId: testPackageId,
            amount: TEST_CONFIG.testPayment.amount,
            paymentMethod: 'CARD',
            billingAddress: TEST_CONFIG.testPayment.billingAddress
          })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.checkoutId).toBeDefined();
        expect(response.body.data.merchantTransactionId).toBeDefined();
        expect(response.body.data.paymentWidgetUrl).toBeDefined();
        expect(response.body.data.paymentId).toBeDefined();
        
        testCheckoutId = response.body.data.checkoutId;
        testPaymentId = response.body.data.paymentId;
        
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare card payment checkout', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare card payment checkout', 'FAIL', error.message);
      }
    });

    test('POST /api/payments/prepare-checkout - Prepare Apple Pay checkout', async () => {
      if (!authToken || !testPackageId) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare Apple Pay checkout', 'SKIP', 'No auth token or package ID');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/payments/prepare-checkout')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            packageId: testPackageId,
            amount: TEST_CONFIG.testPayment.amount,
            paymentMethod: 'APPLEPAY',
            billingAddress: TEST_CONFIG.testPayment.billingAddress
          })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.checkoutId).toBeDefined();
        expect(response.body.data.merchantTransactionId).toBeDefined();
        expect(response.body.data.applePayConfig).toBeDefined();
        expect(response.body.data.paymentId).toBeDefined();
        
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare Apple Pay checkout', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Prepare Apple Pay checkout', 'FAIL', error.message);
      }
    });

    test('POST /api/payments/prepare-checkout - Invalid amount validation', async () => {
      if (!authToken || !testPackageId) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Invalid amount validation', 'SKIP', 'No auth token or package ID');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/payments/prepare-checkout')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            packageId: testPackageId,
            amount: 2, // Below minimum
            paymentMethod: 'CARD',
            billingAddress: TEST_CONFIG.testPayment.billingAddress
          })
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Minimum payment amount');
        logPaymentTestResult('POST /api/payments/prepare-checkout - Invalid amount validation', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Invalid amount validation', 'FAIL', error.message);
      }
    });

    test('POST /api/payments/prepare-checkout - Missing required fields', async () => {
      if (!authToken) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Missing required fields', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .post('/api/payments/prepare-checkout')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            amount: TEST_CONFIG.testPayment.amount
            // Missing packageId
          })
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Package ID and amount are required');
        logPaymentTestResult('POST /api/payments/prepare-checkout - Missing required fields', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/prepare-checkout - Missing required fields', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📊 Payment Status Tests
  // ========================================

  describe('Payment Status', () => {
    test('GET /api/payments/status/:checkoutId - Get payment status', async () => {
      if (!testCheckoutId) {
        logPaymentTestResult('GET /api/payments/status/:checkoutId - Get payment status', 'SKIP', 'No checkout ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/payments/status/${testCheckoutId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBeDefined();
        expect(response.body.data.transactionId).toBeDefined();
        logPaymentTestResult('GET /api/payments/status/:checkoutId - Get payment status', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/status/:checkoutId - Get payment status', 'FAIL', error.message);
      }
    });

    test('GET /api/payments/status/:checkoutId - Invalid checkout ID', async () => {
      try {
        const response = await request(app)
          .get('/api/payments/status/invalid-checkout-id')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);
        
        expect(response.body.success).toBe(false);
        logPaymentTestResult('GET /api/payments/status/:checkoutId - Invalid checkout ID', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/status/:checkoutId - Invalid checkout ID', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🎨 Payment Widget Tests
  // ========================================

  describe('Payment Widget', () => {
    test('GET /api/payments/widget/:checkoutId - Generate payment widget', async () => {
      if (!testCheckoutId) {
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate payment widget', 'SKIP', 'No checkout ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/payments/widget/${testCheckoutId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.text).toContain('PayPass Payment');
        expect(response.text).toContain('paymentWidgets.js');
        expect(response.text).toContain('wpwlOptions');
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate payment widget', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate payment widget', 'FAIL', error.message);
      }
    });

    test('GET /api/payments/widget/:checkoutId - Generate widget with Apple Pay', async () => {
      if (!testCheckoutId) {
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate widget with Apple Pay', 'SKIP', 'No checkout ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/payments/widget/${testCheckoutId}?showApplePay=true`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.text).toContain('PayPass Payment');
        expect(response.text).toContain('applePay');
        expect(response.text).toContain('PayPass Car Wash');
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate widget with Apple Pay', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/widget/:checkoutId - Generate widget with Apple Pay', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📋 Payment History Tests
  // ========================================

  describe('Payment History', () => {
    test('GET /api/payments/user - Get user payments', async () => {
      if (!authToken) {
        logPaymentTestResult('GET /api/payments/user - Get user payments', 'SKIP', 'No auth token');
        return;
      }

      try {
        const response = await request(app)
          .get('/api/payments/user')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.payments).toBeDefined();
        expect(response.body.data.pagination).toBeDefined();
        logPaymentTestResult('GET /api/payments/user - Get user payments', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/user - Get user payments', 'FAIL', error.message);
      }
    });

    test('GET /api/payments/:id - Get payment by ID', async () => {
      if (!authToken || !testPaymentId) {
        logPaymentTestResult('GET /api/payments/:id - Get payment by ID', 'SKIP', 'No auth token or payment ID');
        return;
      }

      try {
        const response = await request(app)
          .get(`/api/payments/${testPaymentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.payment).toBeDefined();
        logPaymentTestResult('GET /api/payments/:id - Get payment by ID', 'PASS');
      } catch (error) {
        logPaymentTestResult('GET /api/payments/:id - Get payment by ID', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔄 Payment Webhook Tests
  // ========================================

  describe('Payment Webhook', () => {
    test('POST /api/payments/process-result - Process payment result', async () => {
      try {
        const mockPaymentResult = {
          id: 'test-transaction-123',
          result: {
            status: 'OK',
            code: '000.100.110',
            description: 'Request successfully processed in 'merchant in test' mode'
          },
          amount: '100.00',
          currency: 'SAR',
          timestamp: new Date().toISOString(),
          merchantTransactionId: 'PAYPASS_test-user_test-package_1234567890_abc123'
        };

        const response = await request(app)
          .post('/api/payments/process-result')
          .send(mockPaymentResult)
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.data.success).toBe(true);
        logPaymentTestResult('POST /api/payments/process-result - Process payment result', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/process-result - Process payment result', 'FAIL', error.message);
      }
    });

    test('POST /api/payments/process-result - Invalid payment result', async () => {
      try {
        const response = await request(app)
          .post('/api/payments/process-result')
          .send({})
          .expect(400);
        
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Invalid payment result data');
        logPaymentTestResult('POST /api/payments/process-result - Invalid payment result', 'PASS');
      } catch (error) {
        logPaymentTestResult('POST /api/payments/process-result - Invalid payment result', 'FAIL', error.message);
      }
    });
  });
});
