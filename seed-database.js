// seed-database.js
require('dotenv').config();
const mongoose = require('mongoose');

// تأكد أن المسارات تتطابق مع مشروعك
const Car = require('./modules/car/car.model');
const Package = require('./modules/package/package.model');
const User = require('./modules/user/user.model');
const Payment = require('./modules/payment/payment.model');
const Wash = require('./modules/wash/wash.model');
const WashingPlace = require('./modules/washingPlace/washingPlace.model');
const Feedback = require('./modules/feedback/feedback.model');
const Notification = require('./modules/feedback/notification.model');

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB Atlas');
}

async function seed() {
  try {
    console.log('🗑️ Clearing old data...');
    await Promise.all([
      Car.deleteMany({}),
      Package.deleteMany({}),
      User.deleteMany({}),
      Payment.deleteMany({}),
      Wash.deleteMany({}),
      WashingPlace.deleteMany({}),
      Feedback.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('📥 Inserting fresh seed data...');
    const cars = await Car.create([
      { make: 'Toyota', model: 'Corolla', year: 2020, plateNumber: 'ABC-1234' },
      { make: 'Honda', model: 'Civic', year: 2021, plateNumber: 'XYZ-5678' }
    ]);

    const packages = await Package.create([
      { name: 'Basic Wash', price: 10, description: 'Basic cleaning package' },
      { name: 'Premium Wash', price: 25, description: 'Full interior and exterior wash' }
    ]);

    const users = await User.create([
      { name: 'Seed User', email: 'seeduser@test.com', password: '123456' },
      { name: process.env.TEST_USER_EMAIL || 'joud@test.com', email: process.env.TEST_USER_EMAIL || 'joud@test.com', password: process.env.TEST_USER_PASSWORD || '123456' }
    ]);

    await Payment.create([{ userId: users[0]._id, amount: 10, method: 'Cash', status: 'Completed' }]);
    await Wash.create([{ carId: cars[0]._id, packageId: packages[0]._id, date: new Date(), status: 'Done' }]);
    await WashingPlace.create([{ name: 'Downtown Car Wash', location: { type: 'Point', coordinates: [46.6753, 24.7136] }, contactNumber: '0100000000' }]);
    await Feedback.create([{ userId: users[0]._id, message: 'Great service!', rating: 5 }]);
    await Notification.create([{ title: 'Welcome!', body: 'Thanks for joining PayPass', userId: users[0]._id }]);

    console.log('🎉 Database seeding completed successfully!');
    console.log({ seedIds: { car: cars[0]._id.toString(), package: packages[0]._id.toString(), user: users[1]._id.toString() }});
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

(async () => {
  await connect();
  await seed();
})();
