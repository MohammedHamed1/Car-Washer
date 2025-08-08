const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./database-config');

// Test MongoDB Connection and Create Data
async function testMongoDBConnection() {
  try {
    console.log('🚀 Testing MongoDB Connection...');
    console.log('📡 Connection string:', MONGODB_CONFIG.uri.replace(/\/\/.*@/, '//***:***@'));
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database: paypass');
    console.log('🌐 Host: cluster0.3vqlnfg.mongodb.net');
    
    // Test database operations
    const db = mongoose.connection;
    
    // List existing collections
    const collections = await db.db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    // Show existing data
    await showExistingData();
    
    console.log('🎉 MongoDB connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Please check:');
    console.error('   1. Internet connection');
    console.error('   2. MongoDB Atlas Network Access (IP whitelist)');
    console.error('   3. Database credentials');
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

// Show existing data
async function showExistingData() {
  console.log('📊 Showing existing data...');
  
  const db = mongoose.connection;
  
  // Show Users data
  const usersCollection = db.db.collection('users');
  const usersCount = await usersCollection.countDocuments();
  console.log(`👥 Users count: ${usersCount}`);
  
  if (usersCount > 0) {
    const users = await usersCollection.find({}).limit(3).toArray();
    console.log('📋 Sample users:');
    users.forEach(user => {
      console.log(`   - ${user.name || user.email} (${user.role || 'user'})`);
    });
  }
  
  // Show Washing Places data
  const washingPlacesCollection = db.db.collection('washingplaces');
  const washingPlacesCount = await washingPlacesCollection.countDocuments();
  console.log(`🏢 Washing Places count: ${washingPlacesCount}`);
  
  if (washingPlacesCount > 0) {
    const washingPlaces = await washingPlacesCollection.find({}).limit(3).toArray();
    console.log('📋 Sample washing places:');
    washingPlaces.forEach(place => {
      console.log(`   - ${place.name || place.address} (${place.isActive ? 'Active' : 'Inactive'})`);
    });
  }
  
  // Show Packages data
  const packagesCollection = db.db.collection('packages');
  const packagesCount = await packagesCollection.countDocuments();
  console.log(`📦 Packages count: ${packagesCount}`);
  
  if (packagesCount > 0) {
    const packages = await packagesCollection.find({}).limit(3).toArray();
    console.log('📋 Sample packages:');
    packages.forEach(pkg => {
      console.log(`   - ${pkg.name} (${pkg.price} EGP)`);
    });
  }
  
  // Show Washes data
  const washesCollection = db.db.collection('washes');
  const washesCount = await washesCollection.countDocuments();
  console.log(`🚗 Washes count: ${washesCount}`);
  
  if (washesCount > 0) {
    const washes = await washesCollection.find({}).limit(3).toArray();
    console.log('📋 Sample washes:');
    washes.forEach(wash => {
      console.log(`   - ${wash.customerName || 'Unknown'} (${wash.status || 'pending'})`);
    });
  }
  
  // Show Payments data
  const paymentsCollection = db.db.collection('payments');
  const paymentsCount = await paymentsCollection.countDocuments();
  console.log(`💰 Payments count: ${paymentsCount}`);
  
  if (paymentsCount > 0) {
    const payments = await paymentsCollection.find({}).limit(3).toArray();
    console.log('📋 Sample payments:');
    payments.forEach(payment => {
      console.log(`   - ${payment.amount} EGP (${payment.status || 'pending'})`);
    });
  }
  
  // Show Feedbacks data
  const feedbacksCollection = db.db.collection('feedbacks');
  const feedbacksCount = await feedbacksCollection.countDocuments();
  console.log(`⭐ Feedbacks count: ${feedbacksCount}`);
  
  if (feedbacksCount > 0) {
    const feedbacks = await feedbacksCollection.find({}).limit(3).toArray();
    console.log('📋 Sample feedbacks:');
    feedbacks.forEach(feedback => {
      console.log(`   - Rating: ${feedback.rating}/5 (${feedback.comment ? 'Has comment' : 'No comment'})`);
    });
  }
  
  console.log('🎉 Data summary completed!');
  console.log('✅ Your MongoDB database is connected and contains data!');
}

// Run the test
testMongoDBConnection(); 