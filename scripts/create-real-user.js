const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_CONFIG } = require('./database-config');

async function createRealUser() {
  try {
    console.log('🚀 Creating real user...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    // Import User model
    const User = require('./modules/user/user.model');
    
    // Hash password
    const password = 'Password@#$123456789';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create real user
    const realUser = new User({
      name: 'Car Washer Admin',
      username: 'carwasher_admin',
      email: 'car.washer.email@gmail.com',
      password: hashedPassword,
      phone: '+966500000000',
      role: 'owner', // Changed from 'admin' to 'owner'
      referralCode: 'REAL001'
    });
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'car.washer.email@gmail.com' });
    if (existingUser) {
      console.log('⚠️ User already exists, updating...');
      existingUser.password = hashedPassword;
      existingUser.role = 'owner';
      existingUser.username = 'carwasher_admin';
      // Add missing fields
      existingUser.isActive = true;
      existingUser.isVerified = true;
      await existingUser.save();
      console.log('✅ User updated successfully!');
    } else {
      // Add missing fields to new user
      realUser.isActive = true;
      realUser.isVerified = true;
      await realUser.save();
      console.log('✅ Real user created successfully!');
    }
    
    console.log('\n📋 Real User Credentials:');
    console.log('==================================================');
    console.log('Email: car.washer.email@gmail.com');
    console.log('Password: Password@#$123456789');
    console.log('Role: owner');
    console.log('==================================================');
    
    console.log('\n🔐 يمكنك استخدام هذه البيانات لتسجيل الدخول في لوحة الإدارة');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

createRealUser(); 