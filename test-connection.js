const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./database-config');

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📡 Connecting to:', MONGODB_CONFIG.uri.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    const db = mongoose.connection;
    console.log('📊 Database name:', db.name);
    console.log('🌐 Database host:', db.host);
    console.log('🔌 Database port:', db.port);
    
    // List collections (if any exist)
    const collections = await db.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    } else {
      console.log('📝 No collections found yet. This is normal for a new database.');
    }
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    console.log('🚀 Ready to run the backend server!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('💡 Please check your MongoDB Atlas settings:');
    console.log('   1. Network Access - make sure your IP is allowed');
    console.log('   2. Database Access - verify username and password');
    console.log('   3. Cluster status - ensure cluster is running');
    process.exit(1);
  }
};

testConnection(); 