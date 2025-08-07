const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_CONFIG } = require('./database-config');

async function createTestUsers() {
  try {
    console.log('🚀 Creating test users...');
    
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection;
    const usersCollection = db.db.collection('users');
    
    // Hash passwords
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const employeePassword = await bcrypt.hash('employee123', saltRounds);
    const ownerPassword = await bcrypt.hash('owner123', saltRounds);
    
         const testUsers = [
       {
         name: 'مدير النظام',
         email: 'admin@paypass.com',
         password: adminPassword,
         phone: '+966501234567',
         role: 'admin',
         referralCode: 'ADMIN001',
         isActive: true,
         isVerified: true,
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
         name: 'موظف النظام',
         email: 'employee@paypass.com',
         password: employeePassword,
         phone: '+966501234568',
         role: 'employee',
         referralCode: 'EMP001',
         isActive: true,
         isVerified: true,
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
         name: 'مالك النظام',
         email: 'owner@paypass.com',
         password: ownerPassword,
         phone: '+966501234569',
         role: 'owner',
         referralCode: 'OWNER001',
         isActive: true,
         isVerified: true,
         createdAt: new Date(),
         updatedAt: new Date()
       }
     ];
    
    // Clear existing test users
    await usersCollection.deleteMany({
      email: { 
        $in: ['admin@paypass.com', 'employee@paypass.com', 'owner@paypass.com'] 
      }
    });
    
    // Insert new test users
    await usersCollection.insertMany(testUsers);
    
    console.log('✅ Test users created successfully!');
    console.log('\n📋 Test Users Credentials:');
    console.log('='.repeat(50));
    console.log('1. مدير النظام:');
    console.log('   Email: admin@paypass.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('');
    console.log('2. موظف النظام:');
    console.log('   Email: employee@paypass.com');
    console.log('   Password: employee123');
    console.log('   Role: employee');
    console.log('');
    console.log('3. مالك النظام:');
    console.log('   Email: owner@paypass.com');
    console.log('   Password: owner123');
    console.log('   Role: owner');
    console.log('');
    console.log('🔐 يمكنك استخدام هذه البيانات لتسجيل الدخول في لوحة الإدارة');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

createTestUsers(); 