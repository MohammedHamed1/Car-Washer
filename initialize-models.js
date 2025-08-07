const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models
const User = require('./modules/user/user.model');
const Car = require('./modules/car/car.model');
const Wash = require('./modules/wash/wash.model');
const Package = require('./modules/package/package.model');
const UserPackage = require('./modules/package/userPackage.model');
const Payment = require('./modules/payment/payment.model');
const Feedback = require('./modules/feedback/feedback.model');
const WashingPlace = require('./modules/washingPlace/washingPlace.model');
const Referral = require('./modules/user/referral.model');

// Connect to MongoDB
const connectAndInitialize = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://CarWasherDB:Password%40%23%24123456789@dartabases.aqbbmr9.mongodb.net/CarWasherDB?retryWrites=true&w=majority&appName=DartaBases');
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Current Collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Create sample data for each model if collections are empty
    await createSampleData();
    
    console.log('\n✅ Model initialization completed!');
    
  } catch (error) {
    console.error('❌ Error initializing models:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
};

const createSampleData = async () => {
  try {
    console.log('\n🔄 Creating sample data...');
    
    // Check if collections have data
    const userCount = await User.countDocuments();
    const carCount = await Car.countDocuments();
    const washCount = await Wash.countDocuments();
    const packageCount = await Package.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const washingPlaceCount = await WashingPlace.countDocuments();
    
    console.log(`📊 Current data counts:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Cars: ${carCount}`);
    console.log(`   Washes: ${washCount}`);
    console.log(`   Packages: ${packageCount}`);
    console.log(`   Payments: ${paymentCount}`);
    console.log(`   Feedbacks: ${feedbackCount}`);
    console.log(`   Washing Places: ${washingPlaceCount}`);
    
    // Create sample data if collections are empty
    if (userCount === 0) {
      console.log('👥 Creating sample user...');
      const sampleUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+966501234567',
        password: 'password123',
        username: 'testuser',
        role: 'user'
      });
      await sampleUser.save();
      console.log('✅ Sample user created');
    }
    
    if (packageCount === 0) {
      console.log('📦 Creating sample package...');
      const samplePackage = new Package({
        name: 'Basic Wash',
        description: 'Basic car wash package',
        price: 50,
        duration: 30
      });
      await samplePackage.save();
      console.log('✅ Sample package created');
    }
    
    if (washingPlaceCount === 0) {
      console.log('🏢 Creating sample washing place...');
      const sampleWashingPlace = new WashingPlace({
        name: 'Main Branch',
        address: 'Riyadh, Saudi Arabia',
        phone: '+966501234567'
      });
      await sampleWashingPlace.save();
      console.log('✅ Sample washing place created');
    }
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

// Run initialization
if (require.main === module) {
  connectAndInitialize();
}

module.exports = { connectAndInitialize }; 