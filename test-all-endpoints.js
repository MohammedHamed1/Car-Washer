// test-all-endpoints.js
require('dotenv').config();
const axios = require('axios');

const API_BASE = process.env.API_BASE_URL || 'https://car-washer-production.up.railway.app/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

let authToken = '';
let userId = '';
let carId = '';
let packageId = '';
let paymentId = '';

// Helper function to log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    let errorMessage = '';
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data) || `HTTP ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response received from server';
    } else {
      // Something else happened
      errorMessage = error.message;
    }
    
    // Log the full error for debugging
    if (error.response) {
      console.log(`DEBUG: ${method} ${endpoint} - Status: ${error.response.status}, Data:`, error.response.data);
    }
    
    return { 
      success: false, 
      error: errorMessage, 
      status: error.response?.status 
    };
  }
}

// Test functions
async function testHealth() {
  log('\n🏥 Testing Health Check...', 'blue');
  
  let result = await makeRequest('GET', '/health');
  if (result.success) {
    log('✅ Health check successful', 'green');
    log(`   Server status: ${result.data.status || 'unknown'}`, 'blue');
  } else {
    log(`❌ Health check failed: ${result.error}`, 'red');
  }
}

async function testAuth() {
  log('\n🔐 Testing Authentication...', 'blue');
  
  // Register user
  const registerData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+966501234567',
    password: 'testpassword123'
  };
  
  let result = await makeRequest('POST', '/users/register', registerData);
  if (result.success) {
    log('✅ User registered successfully', 'green');
    userId = result.data.user?._id || result.data._id || result.data.data?._id;
  } else {
    log(`❌ Registration failed: ${result.error}`, 'red');
  }

  // Login user
  const loginData = {
    email: 'test@example.com',
    password: 'testpassword123'
  };
  
  result = await makeRequest('POST', '/users/login', loginData);
  if (result.success) {
    log('✅ Login successful', 'green');
    // Handle different response formats
    authToken = result.data.token || result.data.data?.token || result.data.user?.token;
    if (!authToken && result.data.user) {
      authToken = result.data.user.token;
    }
  } else {
    log(`❌ Login failed: ${result.error}`, 'red');
  }
}

async function testCars() {
  log('\n🚗 Testing Car Module...', 'blue');
  
  // Create car (requires auth)
  const carData = {
    plateNumber: 'ABC123',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'White',
    size: 'medium'
  };
  
  let result = await makeRequest('POST', '/cars', carData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Car created successfully', 'green');
    carId = result.data._id || result.data.data?._id;
  } else {
    log(`❌ Car creation failed: ${result.error}`, 'red');
  }

  // Get cars (requires auth)
  result = await makeRequest('GET', '/cars', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Cars retrieved successfully', 'green');
  } else {
    log(`❌ Get cars failed: ${result.error}`, 'red');
  }
}

async function testPackages() {
  log('\n📦 Testing Package Module...', 'blue');
  
  // Create package
  const packageData = {
    name: 'Premium Package',
    price: 100,
    washes: 10,
    duration: 30,
    description: 'Premium car wash package'
  };
  
  let result = await makeRequest('POST', '/packages', packageData);
  if (result.success) {
    log('✅ Package created successfully', 'green');
    packageId = result.data._id;
  } else {
    log(`❌ Package creation failed: ${result.error}`, 'red');
  }

  // Get all packages
  result = await makeRequest('GET', '/packages');
  if (result.success) {
    log('✅ Packages retrieved successfully', 'green');
  } else {
    log(`❌ Get packages failed: ${result.error}`, 'red');
  }

  // Test QR scan
  const qrData = { qrCode: 'test_qr_code_123' };
  result = await makeRequest('POST', '/packages/scan-qr', qrData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ QR scan successful', 'green');
  } else {
    log(`❌ QR scan failed: ${result.error}`, 'red');
  }
}

async function testPayments() {
  log('\n💳 Testing Payment Module...', 'blue');
  
  // Test HyperPay checkout
  const checkoutData = {
    amount: 50,
    paymentType: 'card',
    customerData: {
      email: 'test@example.com',
      givenName: 'Test',
      surname: 'User',
      street: '123 Test Street',
      city: 'Riyadh',
      state: 'Riyadh',
      country: 'SA',
      postcode: '12345'
    }
  };
  
  let result = await makeRequest('POST', '/payments/hyperpay-checkout', checkoutData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ HyperPay checkout created successfully', 'green');
  } else {
    log(`❌ HyperPay checkout failed: ${result.error}`, 'red');
  }

  // Get all payments
  result = await makeRequest('GET', '/payments', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Payments retrieved successfully', 'green');
  } else {
    log(`❌ Get payments failed: ${result.error}`, 'red');
  }
}

async function testFeedback() {
  log('\n📝 Testing Feedback Module...', 'blue');
  
  // Create feedback
  const feedbackData = {
    rating: 5,
    comment: 'Excellent service!',
    washingPlaceId: 'test_place_id'
  };
  
  let result = await makeRequest('POST', '/feedbacks', feedbackData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Feedback created successfully', 'green');
  } else {
    log(`❌ Feedback creation failed: ${result.error}`, 'red');
  }

  // Get all feedback
  result = await makeRequest('GET', '/feedbacks');
  if (result.success) {
    log('✅ Feedback retrieved successfully', 'green');
  } else {
    log(`❌ Get feedback failed: ${result.error}`, 'red');
  }
}

async function testNotifications() {
  log('\n🔔 Testing Notification Module...', 'blue');
  
  // Create notification
  const notificationData = {
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'info'
  };
  
  let result = await makeRequest('POST', '/notifications', notificationData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Notification created successfully', 'green');
  } else {
    log(`❌ Notification creation failed: ${result.error}`, 'red');
  }

  // Get all notifications
  result = await makeRequest('GET', '/notifications', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Notifications retrieved successfully', 'green');
  } else {
    log(`❌ Get notifications failed: ${result.error}`, 'red');
  }
}

async function testUserPackages() {
  log('\n👥 Testing UserPackage Module...', 'blue');
  
  // Get user packages
  let result = await makeRequest('GET', '/user-packages', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ User packages retrieved successfully', 'green');
  } else {
    log(`❌ Get user packages failed: ${result.error}`, 'red');
  }

  // Get active user packages
  result = await makeRequest('GET', '/user-packages/active', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Active user packages retrieved successfully', 'green');
  } else {
    log(`❌ Get active user packages failed: ${result.error}`, 'red');
  }
}

async function testReferrals() {
  log('\n🔄 Testing Referral Module...', 'blue');
  
  // Create referral
  const referralData = {
    referredEmail: 'referred@example.com',
    referredPhone: '+966501234568'
  };
  
  let result = await makeRequest('POST', '/referrals', referralData, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Referral created successfully', 'green');
  } else {
    log(`❌ Referral creation failed: ${result.error}`, 'red');
  }

  // Get all referrals
  result = await makeRequest('GET', '/referrals', null, { Authorization: `Bearer ${authToken}` });
  if (result.success) {
    log('✅ Referrals retrieved successfully', 'green');
  } else {
    log(`❌ Get referrals failed: ${result.error}`, 'red');
  }
}

// Main test function
async function runAllTests() {
  log('🚀 Starting PayPass API Tests...', 'bold');
  log(`API Base URL: ${API_BASE}`, 'yellow');
  
  try {
    await testHealth();
    await testAuth();
    await testCars();
    await testPackages();
    await testPayments();
    await testFeedback();
    await testNotifications();
    await testUserPackages();
    await testReferrals();
    
    log('\n🎉 All tests completed!', 'bold');
    log('Check the results above for any errors.', 'yellow');
    
  } catch (error) {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testAuth,
  testCars,
  testPackages,
  testPayments,
  testFeedback,
  testNotifications,
  testUserPackages,
  testReferrals
};
