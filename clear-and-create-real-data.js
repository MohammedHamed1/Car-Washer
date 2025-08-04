const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./database-config');

async function clearAndCreateRealData() {
  try {
    console.log('🚀 Clearing all test data and creating real data...');
    
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection;
    
    // Clear all collections
    console.log('🧹 Clearing all test data...');
    const collections = ['packages', 'washingplaces', 'washes', 'payments', 'feedbacks', 'cars', 'notifications', 'referrals', 'userpackages'];
    
    for (const collectionName of collections) {
      try {
        const collection = db.db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`✅ Cleared ${result.deletedCount} documents from ${collectionName}`);
      } catch (error) {
        console.log(`⚠️  Could not clear ${collectionName}: ${error.message}`);
      }
    }
    
    console.log('✅ All test data cleared!');
    
    // Create Real Washing Places in Riyadh
    console.log('\n🏢 Creating real washing places in Riyadh...');
    const washingPlacesCollection = db.db.collection('washingplaces');
    
    const washingPlaces = [
      {
        name: 'مغسلة الرياض الأولى',
        address: 'الرياض، شارع الملك فهد، حي النزهة',
        phone: '+966501234567',
        hours: '24/7',
        email: 'branch1@paypass.com',
        location: 'Point',
        city: 'الرياض',
        rating: 4.5,
        customers: 150,
        status: 'active',
        activeOrders: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'مغسلة الرياض الثانية',
        address: 'الرياض، شارع التحلية، حي السليمانية',
        phone: '+966501234568',
        hours: '24/7',
        email: 'branch2@paypass.com',
        location: 'Point',
        city: 'الرياض',
        rating: 4.3,
        customers: 120,
        status: 'active',
        activeOrders: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'مغسلة الرياض الثالثة',
        address: 'الرياض، شارع العليا، حي العليا',
        phone: '+966501234569',
        hours: '24/7',
        email: 'branch3@paypass.com',
        location: 'Point',
        city: 'الرياض',
        rating: 4.7,
        customers: 180,
        status: 'active',
        activeOrders: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'مغسلة الرياض الرابعة',
        address: 'الرياض، شارع الملك عبدالله، حي الملقا',
        phone: '+966501234570',
        hours: '24/7',
        email: 'branch4@paypass.com',
        location: 'Point',
        city: 'الرياض',
        rating: 4.4,
        customers: 140,
        status: 'active',
        activeOrders: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await washingPlacesCollection.insertMany(washingPlaces);
    console.log('✅ Real washing places created!');
    
    // Create Real Packages
    console.log('\n📦 Creating real packages...');
    const packagesCollection = db.db.collection('packages');
    
    const packages = [
      {
        name: 'الباقة الأساسية',
        description: 'غسيل خارجي شامل للسيارة مع تجفيف وتنظيف الزجاج',
        price: 50,
        duration: 30,
        status: 'active',
        basePrice: 50,
        originalPrice: 70,
        features: ['غسيل خارجي', 'تجفيف', 'تنظيف الزجاج'],
        popular: false,
        washes: 1,
        savings: 20,
        size: 'small',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الباقة المتقدمة',
        description: 'غسيل شامل للسيارة من الداخل والخارج مع معطر',
        price: 80,
        duration: 45,
        status: 'active',
        basePrice: 80,
        originalPrice: 110,
        features: ['غسيل خارجي', 'غسيل داخلي', 'تجفيف', 'تنظيف الزجاج', 'معطر'],
        popular: true,
        washes: 1,
        savings: 30,
        size: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الباقة الشاملة',
        description: 'غسيل شامل مع تلميع وإكسسوارات',
        price: 120,
        duration: 60,
        status: 'active',
        basePrice: 120,
        originalPrice: 160,
        features: ['غسيل خارجي', 'غسيل داخلي', 'تجفيف', 'تنظيف الزجاج', 'معطر', 'تلميع'],
        popular: false,
        washes: 1,
        savings: 40,
        size: 'large',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await packagesCollection.insertMany(packages);
    console.log('✅ Real packages created!');
    
    console.log('\n🎉 REAL DATA CREATED SUCCESSFULLY!');
    console.log('📊 Summary:');
    console.log('   - 4 Washing Places in Riyadh');
    console.log('   - 3 Real Packages (الأساسية، المتقدمة، الشاملة)');
    console.log('');
    console.log('📦 PACKAGES:');
    console.log('='.repeat(50));
    
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Price: ${pkg.price} SAR`);
      console.log(`   Original Price: ${pkg.originalPrice} SAR`);
      console.log(`   Savings: ${pkg.savings} SAR`);
      console.log(`   Duration: ${pkg.duration} minutes`);
      console.log(`   Features: ${pkg.features.join(', ')}`);
      console.log('');
    });
    
    console.log('🏢 WASHING PLACES:');
    console.log('='.repeat(50));
    
    washingPlaces.forEach((branch, index) => {
      console.log(`${index + 1}. ${branch.name}`);
      console.log(`   Address: ${branch.address}`);
      console.log(`   Phone: ${branch.phone}`);
      console.log(`   Rating: ${branch.rating}/5`);
      console.log(`   Active Orders: ${branch.activeOrders}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

clearAndCreateRealData(); 