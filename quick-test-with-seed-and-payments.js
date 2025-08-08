// quick-test-with-seed-and-payments.js
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const paymentService = require('./services/payment.service');

// import models (used for seed cleanup if needed)
const Car = require('./modules/car/car.model');
const Package = require('./modules/package/package.model');
const User = require('./modules/user/user.model');
// ... (others if needed)

const API = process.env.API_BASE_URL || 'http://localhost:5000/api';

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB Atlas');
}

async function seedMinimal() {
  // reuse seed or minimal seed
  await Promise.all([Car.deleteMany({}), Package.deleteMany({}), User.deleteMany({})]);
  const cars = await Car.create([{ make: 'Toyota', model: 'Corolla', year: 2020, plateNumber: 'ABC-1234' }]);
  const packages = await Package.create([{ name: 'Basic Wash', price: 10, description: 'Basic cleaning package' }]);
  const users = await User.create([{ name: 'Seed User', email: 'seeduser@test.com', password: '123456' }]);
  return { car: cars[0], pkg: packages[0], user: users[0] };
}

async function runTests() {
  try {
    console.log('🚀 Running quick tests (seeded data)...');

    const { car, pkg, user } = await seedMinimal();

    // register test user via API (if your API hashes password, use API route)
    let regRes;
    try {
      regRes = await axios.post(`${API}/users/register`, { name: 'TestUserAPI', email: 'api_test_user@test.com', password: 'testpass123' }, { timeout: 7000 });
      console.log('✅ POST /users/register -', regRes.status);
    } catch (e) {
      console.warn('⚠️ register API returned:', e.response?.status || e.message);
    }

    // create package via API
    try {
      const pkgRes = await axios.post(`${API}/packages`, { name: 'API Package', price: 5, description: 'From quick test' }, { timeout: 7000, headers: { 'Content-Type': 'application/json' } });
      console.log('✅ POST /packages -', pkgRes.status);
    } catch (e) {
      console.warn('⚠️ create package returned:', e.response?.status || e.message);
    }

    // QR generation test
    try {
      const qrRes = await axios.post(`${API}/qr/generate`, { data: `user:${user._id}|pkg:${pkg._id}` }, { timeout: 10000 });
      console.log('✅ POST /qr/generate -', qrRes.status);
    } catch (e) {
      console.warn('⚠️ QR generate returned:', e.response?.status || e.message);
    }

    // Payment checkout (LIVE) — create checkout, then instruct manual payment step.
    console.log('💳 Creating HyperPay checkout (LIVE) for 5 SAR — CAUTION: will be LIVE if credentials are live');
    const checkout = await paymentService.createCheckout({
      amount: 5,
      paymentType: 'card',
      customerData: {
        email: process.env.TEST_USER_EMAIL,
        firstName: 'Joud',
        lastName: 'Mk',
        street: 'King Fahd Rd',
        city: 'Riyadh',
        state: 'Riyadh',
        country: 'SA',
        postcode: '12345'
      }
    });

    console.log('✅ Checkout created (inspect response object):');
    console.log(checkout); // contains id/redirect info

    console.log('➡️ To complete live payment: open payment widget URL in browser or embed paymentWidgets.js with checkoutId');
    console.log('Example widget script URL: https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=' + checkout.id);

    // after manual payment performed, you can poll status:
    // const status = await paymentService.getPaymentStatus(checkout.id);
    // console.log('Payment status:', status);

    console.log('✅ Quick tests completed.');
  } catch (err) {
    console.error('❌ Quick-test error:', err.response?.data || err.message || err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 DB connection closed');
  }
}

(async () => {
  await connectDB();
  await runTests();
})();
