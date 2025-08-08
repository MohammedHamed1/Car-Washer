const request = require('supertest');
const app = require('../index');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const Package = require('../models/package.model');

describe('Payment Gateway Tests', () => {
  let testUser, testPackage, authToken;

  beforeAll(async () => {
    // Create test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+966501234567',
      password: 'testpassword123'
    });
    await testUser.save();

    // Create test package
    testPackage = new Package({
      name: 'Test Package',
      price: 50,
      washes: 5,
      duration: 30,
      description: 'Test package for payment testing'
    });
    await testPackage.save();

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Package.deleteMany({});
    await Payment.deleteMany({});
  });

  describe('HyperPay Integration Tests', () => {
    test('should prepare checkout for regular payment', async () => {
      const response = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 50,
          paymentMethod: 'CARD',
          billingAddress: {
            street1: 'Test Street 123',
            city: 'Riyadh',
            state: 'Riyadh',
            country: 'SA',
            postcode: '12345'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('checkoutId');
      expect(response.body.data).toHaveProperty('merchantTransactionId');
      expect(response.body.data).toHaveProperty('paymentWidgetUrl');
    }, 30000);

    test('should prepare checkout for Apple Pay', async () => {
      const response = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 50,
          paymentMethod: 'APPLEPAY',
          billingAddress: {
            street1: 'Test Street 123',
            city: 'Riyadh',
            state: 'Riyadh',
            country: 'SA',
            postcode: '12345'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('checkoutId');
      expect(response.body.data).toHaveProperty('merchantTransactionId');
      expect(response.body.data).toHaveProperty('applePayConfig');
    }, 30000);

    test('should validate minimum payment amount', async () => {
      const response = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 2, // Below minimum
          paymentMethod: 'CARD'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Minimum payment amount');
    });

    test('should validate maximum payment amount', async () => {
      const response = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 15000, // Above maximum
          paymentMethod: 'CARD'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Maximum payment amount');
    });

    test('should get payment configuration', async () => {
      const response = await request(app)
        .get('/api/payments/config')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('baseUrl');
      expect(response.body.data).toHaveProperty('entityId');
      expect(response.body.data).toHaveProperty('applePayEntityId');
      expect(response.body.data).toHaveProperty('supportedMethods');
      expect(response.body.data.supportedMethods).toContain('APPLEPAY');
    });

    test('should get supported payment methods', async () => {
      const response = await request(app)
        .get('/api/payments/methods')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.methods).toContain('VISA');
      expect(response.body.data.methods).toContain('MASTER');
      expect(response.body.data.methods).toContain('MADA');
      expect(response.body.data.methods).toContain('APPLEPAY');
    });
  });

  describe('Payment Widget Tests', () => {
    test('should generate payment widget HTML', async () => {
      // First create a checkout
      const checkoutResponse = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 50,
          paymentMethod: 'CARD',
          billingAddress: {
            street1: 'Test Street 123',
            city: 'Riyadh',
            state: 'Riyadh',
            country: 'SA',
            postcode: '12345'
          }
        });

      const checkoutId = checkoutResponse.body.data.checkoutId;

      const response = await request(app)
        .get(`/api/payments/widget/${checkoutId}`)
        .query({ showApplePay: 'true' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('wpwlOptions');
      expect(response.text).toContain('applePay');
      expect(response.text).toContain('MyStore');
    }, 30000);

    test('should generate payment widget without Apple Pay', async () => {
      // First create a checkout
      const checkoutResponse = await request(app)
        .post('/api/payments/prepare-checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          packageId: testPackage._id,
          amount: 50,
          paymentMethod: 'CARD',
          billingAddress: {
            street1: 'Test Street 123',
            city: 'Riyadh',
            state: 'Riyadh',
            country: 'SA',
            postcode: '12345'
          }
        });

      const checkoutId = checkoutResponse.body.data.checkoutId;

      const response = await request(app)
        .get(`/api/payments/widget/${checkoutId}`)
        .query({ showApplePay: 'false' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('wpwlOptions');
      expect(response.text).not.toContain('applePay');
    }, 30000);
  });

  describe('Payment Status Tests', () => {
    test('should handle invalid checkout ID', async () => {
      const response = await request(app)
        .get('/api/payments/status/invalid-checkout-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle missing checkout ID', async () => {
      const response = await request(app)
        .get('/api/payments/status/')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('User Payments Tests', () => {
    test('should get user payments', async () => {
      const response = await request(app)
        .get('/api/payments/user')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('payments');
      expect(response.body.data).toHaveProperty('pagination');
    });

    test('should get user payments with pagination', async () => {
      const response = await request(app)
        .get('/api/payments/user')
        .query({ page: 1, limit: 5 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });
});
