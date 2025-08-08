require('dotenv').config();
const mongoose = require('mongoose');

// استدعاء كل الموديلات
const Car = require('../models/car.model');
const Package = require('../models/package.model');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');
const Wash = require('../models/wash.model');
const WashingPlace = require('../models/washingPlace.model');
const Feedback = require('../models/feedback.model');
const Notification = require('../models/notification.model');

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });

const seedData = async () => {
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

    console.log('📥 Inserting fresh data...');

    // Create a simple package for testing
    const packageData = {
      _id: 'basic-wash',
      type: 'basic',
      name: 'غسيل أساسي',
      nameEn: 'Basic Wash',
      description: 'غسيل أساسي للسيارة',
      descriptionEn: 'Basic car wash service',
      price: 10,
      originalPrice: 15,
      savings: 5,
      washes: 1,
      paidWashes: 1,
      freeWashes: 0,
      duration: 30,
      icon: '🚗',
      color: '#4CAF50',
      recommendedFor: 'السيارات الصغيرة والمتوسطة',
      recommendedForEn: 'Small and medium cars',
      basePrice: 10,
      carPrices: { small: 10, medium: 15, large: 20 },
      carPricesOriginal: { small: 15, medium: 20, large: 25 },
      carPricesSavings: { small: 5, medium: 5, large: 5 },
      pricing: { small: 10, medium: 15, large: 20 }
    };

    const packages = await Package.create([packageData]);

    const users = await User.create([
      { 
        name: 'Test User 1', 
        email: 'user1@test.com', 
        phone: '0100000001',
        username: 'user1',
        password: '123456',
        referralCode: 'USER001'
      },
      { 
        name: 'Test User 2', 
        email: 'user2@test.com', 
        phone: '0100000002',
        username: 'user2',
        password: '123456',
        referralCode: 'USER002'
      }
    ]);

    const cars = await Car.create([
      { 
        user: users[0]._id,
        size: 'medium',
        make: 'Toyota', 
        model: 'Corolla', 
        year: 2020, 
        plateNumber: 'ABC-1234' 
      },
      { 
        user: users[1]._id,
        size: 'large',
        make: 'Honda', 
        model: 'Civic', 
        year: 2021, 
        plateNumber: 'XYZ-5678' 
      }
    ]);

    console.log('✅ Created users:', users.length);
    console.log('✅ Created cars:', cars.length);
    console.log('✅ Created packages:', packages.length);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
