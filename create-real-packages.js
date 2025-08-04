const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./database-config');

async function createRealPackages() {
  try {
    console.log('🚀 Creating Real PayPass Packages...');
    
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection;
    
    // Clear existing packages
    console.log('🧹 Clearing existing packages...');
    const packagesCollection = db.db.collection('packages');
    await packagesCollection.deleteMany({});
    console.log('✅ Existing packages cleared');
    
    // Create Real Packages
    console.log('📦 Creating real packages...');
    
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
    
    console.log('\n📦 REAL PACKAGES CREATED:');
    console.log('='.repeat(50));
    
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Description: ${pkg.description}`);
      console.log(`   Price: ${pkg.price} SAR`);
      console.log(`   Original Price: ${pkg.originalPrice} SAR`);
      console.log(`   Savings: ${pkg.savings} SAR`);
      console.log(`   Duration: ${pkg.duration} minutes`);
      console.log(`   Features: ${pkg.features.join(', ')}`);
      console.log(`   Popular: ${pkg.popular ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    console.log('🎉 Real packages created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating real packages:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

createRealPackages(); 