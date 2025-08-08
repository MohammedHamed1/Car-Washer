// Test setup file for Jest
require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(60000); // زيادة timeout للاختبارات المعقدة

// Global test utilities
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock environment variables for testing
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://elhadad3593:NIqGTCLDJJFOFbtf@cluster0.3vqlnfg.mongodb.net/paypass-test?retryWrites=true&w=majority';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_2024';
process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Test configuration
global.TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api',
  timeout: 30000, // زيادة timeout للاختبارات
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

// Helper functions for tests
global.testHelpers = {
  // Generate test token
  generateTestToken: (userId = 'test-user-id') => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  },

  // Create test user data
  createTestUser: (overrides = {}) => ({
    email: 'test@paypass.com',
    password: 'test123456',
    phone: '+966501234567',
    name: 'Test User',
    ...overrides
  }),

  // Create test car data
  createTestCar: (overrides = {}) => ({
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'White',
    plateNumber: 'ABC123',
    size: 'medium',
    ...overrides
  }),

  // Create test package data
  createTestPackage: (overrides = {}) => ({
    name: 'Test Package',
    price: 100,
    washesIncluded: 5,
    description: 'Test package for API testing',
    ...overrides
  }),

  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Clean up test data
  cleanupTestData: async (mongoose) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const collection of collections) {
        if (collection.name.includes('test') || collection.name.includes('temp')) {
          await mongoose.connection.db.collection(collection.name).drop();
        }
      }
    } catch (error) {
      console.log('Cleanup warning:', error.message);
    }
  }
};

// Before all tests
beforeAll(async () => {
  console.log('🚀 Setting up test environment...');
  console.log(`📡 API Base URL: ${process.env.API_BASE_URL}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI}`);
});

// After all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
});

// Global error handler for tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
