const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models to ensure they are registered
require('./modules/user/user.model');
require('./modules/car/car.model');
require('./modules/washingPlace/washingPlace.model');
require('./modules/package/package.model');
require('./modules/package/userPackage.model');
require('./modules/wash/wash.model');
require('./modules/payment/payment.model');
require('./modules/feedback/feedback.model');
require('./modules/feedback/notification.model');
require('./modules/user/referral.model');

async function checkAllModels() {
  try {
    console.log('🔍 Checking all models...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://CarWasherDB:Password%40%23%24123456789@dartabases.aqbbmr9.mongodb.net/CarWasherDB?retryWrites=true&w=majority&appName=DartaBases');
    console.log('✅ Connected to MongoDB');
    
    // Get all registered models
    const modelNames = Object.keys(mongoose.models);
    console.log(`\n📋 Found ${modelNames.length} registered models:`);
    
    modelNames.forEach((modelName, index) => {
      console.log(`   ${index + 1}. ${modelName}`);
    });
    
    // Check collections in database
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    console.log(`\n📁 Found ${collections.length} collections in database:`);
    
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    // Check if all models have corresponding collections
    console.log('\n🔍 Checking model-collection mapping:');
    
    for (const modelName of modelNames) {
      const collectionName = mongoose.models[modelName].collection.name;
      const collectionExists = collections.some(c => c.name === collectionName);
      
      if (collectionExists) {
        const count = await mongoose.models[modelName].countDocuments();
        console.log(`   ✅ ${modelName} -> ${collectionName} (${count} documents)`);
      } else {
        console.log(`   ⚠️  ${modelName} -> ${collectionName} (collection not found)`);
      }
    }
    
    // Test creating sample documents for empty collections
    console.log('\n🧪 Testing model creation...');
    
    const testResults = [];
    
    for (const modelName of modelNames) {
      try {
        const Model = mongoose.models[modelName];
        const count = await Model.countDocuments();
        
        if (count === 0) {
          console.log(`   📝 Creating test document for ${modelName}...`);
          
          // Create minimal test document based on model
          let testDoc = {};
          
          switch (modelName) {
            case 'User':
              testDoc = {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+966501234567',
                password: 'password123',
                username: 'testuser',
                role: 'user'
              };
              break;
            case 'Car':
              testDoc = {
                user: new mongoose.Types.ObjectId(),
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                licensePlate: 'ABC123',
                type: 'sedan',
                size: 'medium'
              };
              break;
            case 'WashingPlace':
              testDoc = {
                name: 'Test Branch',
                address: 'Test Address',
                phone: '+966501234567',
                hours: '24/7'
              };
              break;
            case 'Package':
              testDoc = {
                name: 'Test Package',
                basePrice: 50,
                originalPrice: 60,
                features: ['Basic Wash'],
                washes: 1,
                savings: 10,
                duration: 30,
                size: 'medium'
              };
              break;
            default:
              console.log(`   ⚠️  No test template for ${modelName}`);
              continue;
          }
          
          const newDoc = new Model(testDoc);
          await newDoc.save();
          console.log(`   ✅ Created test document for ${modelName}`);
          testResults.push({ model: modelName, status: 'created' });
          
        } else {
          console.log(`   ✅ ${modelName} has ${count} documents`);
          testResults.push({ model: modelName, status: 'exists', count });
        }
        
      } catch (error) {
        console.log(`   ❌ Error with ${modelName}: ${error.message}`);
        testResults.push({ model: modelName, status: 'error', error: error.message });
      }
    }
    
    console.log('\n📊 Test Results Summary:');
    testResults.forEach(result => {
      const status = result.status === 'created' ? '✅' : 
                    result.status === 'exists' ? '📊' : '❌';
      console.log(`   ${status} ${result.model}: ${result.status}${result.count ? ` (${result.count} docs)` : ''}`);
    });
    
    console.log('\n🎉 Model check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking models:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

// Run the check
if (require.main === module) {
  checkAllModels();
}

module.exports = { checkAllModels }; 