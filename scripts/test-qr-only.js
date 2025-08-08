#!/usr/bin/env node

/**
 * 🚀 Quick QR Code Test Script
 * 
 * هذا السكريبت يختبر QR Code endpoints فقط
 * بدون الحاجة لـ authentication
 */

const request = require('supertest');
const express = require('express');

// Simple expect function for testing
const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${actual} to be ${expected}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined || actual === null) {
      throw new Error(`Expected ${actual} to be defined`);
    }
  },
  toMatch: (regex) => {
    if (!regex.test(actual)) {
      throw new Error(`Expected ${actual} to match ${regex}`);
    }
  }
});

// Create Express app for testing
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(express.json());

// Load routes
const routes = require('../routes');
app.use('/api', routes);

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  apiUrl: 'http://localhost:5000/api',
  timeout: 5000
};

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Helper function to log results
const logResult = (testName, success, error = '') => {
  results.total++;
  if (success) {
    results.passed++;
    console.log(`✅ ${testName} - PASS`);
  } else {
    results.failed++;
    console.log(`❌ ${testName} - FAIL: ${error}`);
  }
  results.details.push({ name: testName, success, error });
};

// Helper function to print report
const printReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 QR CODE QUICK TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.details
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.error}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
};

// Main test function
async function runQRTests() {
  console.log('🚀 Starting Quick QR Code Tests...');
  console.log(`📡 API Base URL: ${TEST_CONFIG.apiUrl}`);
  console.log(`⏱️  Timeout: ${TEST_CONFIG.timeout}ms\n`);

  // Test 1: Generate basic QR code
  try {
    const response = await request(app)
      .post('/api/qr/generate')
      .send({ data: 'PAYPASS-TEST-12345' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.qrCode).toBeDefined();
    logResult('Generate basic QR code', true);
  } catch (error) {
    logResult('Generate basic QR code', false, error.message);
  }

  // Test 2: Generate QR with special characters
  try {
    const response = await request(app)
      .post('/api/qr/generate')
      .send({ data: 'PAYPASS-USER-123-عربي-123' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.qrCode).toBeDefined();
    logResult('Generate QR with special characters', true);
  } catch (error) {
    logResult('Generate QR with special characters', false, error.message);
  }

  // Test 3: Generate QR with JSON data
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
    logResult('Generate QR with JSON data', true);
  } catch (error) {
    logResult('Generate QR with JSON data', false, error.message);
  }

  // Test 4: Missing data validation
  try {
    const response = await request(app)
      .post('/api/qr/generate')
      .send({})
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Data is required');
    logResult('Missing data validation', true);
  } catch (error) {
    logResult('Missing data validation', false, error.message);
  }

  // Test 5: Scan valid QR code
  try {
    const testQRData = 'PAYPASS-SCAN-TEST-12345';
    const response = await request(app)
      .post('/api/qr/scan')
      .send({ qrData: testQRData })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.scannedData).toBe(testQRData);
    logResult('Scan valid QR code', true);
  } catch (error) {
    logResult('Scan valid QR code', false, error.message);
  }

  // Test 6: Scan QR with JSON data
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
    logResult('Scan QR with JSON data', true);
  } catch (error) {
    logResult('Scan QR with JSON data', false, error.message);
  }

  // Test 7: Missing QR data validation
  try {
    const response = await request(app)
      .post('/api/qr/scan')
      .send({})
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('QR data is required');
    logResult('Missing QR data validation', true);
  } catch (error) {
    logResult('Missing QR data validation', false, error.message);
  }

  // Test 8: Validate valid QR code
  try {
    const validQRCode = 'QR_123456789_test';
    const response = await request(app)
      .post('/api/qr/validate')
      .send({ qrCode: validQRCode })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.isValid).toBe(true);
    logResult('Validate valid QR code', true);
  } catch (error) {
    logResult('Validate valid QR code', false, error.message);
  }

  // Test 9: Validate invalid QR code
  try {
    const invalidQRCode = 'INVALID_QR_CODE';
    const response = await request(app)
      .post('/api/qr/validate')
      .send({ qrCode: invalidQRCode })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.isValid).toBe(false);
    logResult('Validate invalid QR code', true);
  } catch (error) {
    logResult('Validate invalid QR code', false, error.message);
  }

  // Test 10: Missing QR code validation
  try {
    const response = await request(app)
      .post('/api/qr/validate')
      .send({})
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('QR code is required');
    logResult('Missing QR code validation', true);
  } catch (error) {
    logResult('Missing QR code validation', false, error.message);
  }

  // Test 11: QR Service integration
  try {
    const { generateQRCode, generateUniqueBarcode } = require('../services/barcode.service');
    
    // Test barcode generation
    const barcode = generateUniqueBarcode('test-user-123', 'test-package-456');
    expect(barcode).toMatch(/^PAYPASS-/);
    
    // Test QR code generation
    const qrCode = await generateQRCode(barcode);
    expect(qrCode).toMatch(/^data:image\/png;base64,/);
    
    logResult('QR Service integration', true);
  } catch (error) {
    logResult('QR Service integration', false, error.message);
  }

  // Test 12: Barcode validation service
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
    
    logResult('Barcode validation service', true);
  } catch (error) {
    logResult('Barcode validation service', false, error.message);
  }

  // Print final report
  printReport();

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runQRTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
