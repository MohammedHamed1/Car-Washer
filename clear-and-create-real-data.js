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
        description: 'الخيار المثالي لمن يبحث عن نظافة أساسية مع توفير إضافي!',
        price: 150,
        duration: 30,
        status: 'active',
        basePrice: 150,
        originalPrice: 235,
        features: [
          '4 غسلات باستخدام صابون إيطالي فاخر عالي الجودة',
          'غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم',
          'غسلة إضافية مجانية، ليصبح إجمالي الغسلات: 5',
          'إجمالي التوفير: 85 ريال سعودي',
          'صالحة لمدة شهر واحد من تاريخ الشراء'
        ],
        popular: false,
        washes: 5,
        savings: 85,
        size: 'small',
        isVIP: false,
        pricing: {
          small: 150,
          medium: 200,
          large: 250
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الباقة المتقدمة',
        description: 'الخيار العملي للنظافة المثالية بسعر تنافسي.',
        price: 280,
        duration: 30,
        status: 'active',
        basePrice: 280,
        originalPrice: 420,
        features: [
          '8 غسلات باستخدام صابون إيطالي فاخر يمنح سيارتك العناية التي تستحقها',
          'غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم',
          'غسلتان مجانيتان، ليصبح إجمالي الغسلات: 10',
          'إجمالي التوفير: 140 ريال سعودي',
          'صالحة لمدة شهر واحد من تاريخ الشراء'
        ],
        popular: true,
        washes: 10,
        savings: 140,
        size: 'medium',
        isVIP: false,
        pricing: {
          small: 280,
          medium: 350,
          large: 420
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الباقة الشاملة',
        description: 'الخيار الأمثل لمن يريد العناية القصوى بسياراته مع أكبر قدر من التوفير.',
        price: 490,
        duration: 30,
        status: 'active',
        basePrice: 490,
        originalPrice: 770,
        features: [
          '14 غسلة باستخدام صابون إيطالي فاخر يوفر عناية فائقة بسيارتك',
          'غسيل بطبقتين من الصابون لضمان إزالة الأوساخ بفعالية وحماية طويلة الأمد',
          '4 غسلات مجانية، ليصبح إجمالي الغسلات: 18',
          'إجمالي التوفير: 280 ريال سعودي',
          'صالحة لمدة شهر واحد من تاريخ الشراء'
        ],
        popular: false,
        washes: 18,
        savings: 280,
        size: 'large',
        isVIP: false,
        pricing: {
          small: 490,
          medium: 600,
          large: 770
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'باقة VIP',
        description: 'خدمة VIP متميزة في الفنادق المحددة فقط',
        price: 150,
        duration: 60,
        status: 'active',
        basePrice: 150,
        originalPrice: 235,
        features: [
          'غسيل شامل',
          'تشمل الموقف والفالية',
          'خدمة VIP متميزة',
          'صالح في الفنادق المحددة فقط',
          'خدمة متميزة',
          'ضمان الجودة',
          'توفير 85 ريال'
        ],
        popular: false,
        washes: 1,
        savings: 85,
        size: 'small',
        isVIP: true,
        pricing: {
          small: 150,   // ثابت لجميع الأحجام
          medium: 150,  // ثابت لجميع الأحجام
          large: 150    // ثابت لجميع الأحجام
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await packagesCollection.insertMany(packages);
    console.log('✅ Real packages created!');
    
    console.log('\n🎉 REAL DATA CREATED SUCCESSFULLY!');
    console.log('📊 Summary:');
    console.log('   - 4 Washing Places in Riyadh');
    console.log('   - 4 Real Packages (الأساسية، المتقدمة، الشاملة، VIP)');
    console.log('');
    console.log('📦 PACKAGES:');
    console.log('='.repeat(50));
    
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Description: ${pkg.description}`);
      console.log(`   Base Price: ${pkg.basePrice} SAR`);
      console.log(`   Original Price: ${pkg.originalPrice} SAR`);
      console.log(`   Savings: ${pkg.savings} SAR`);
      console.log(`   Duration: ${pkg.duration} days`);
      console.log(`   Washes: ${pkg.washes}`);
      console.log(`   Popular: ${pkg.popular ? 'Yes' : 'No'}`);
      console.log(`   VIP Package: ${pkg.isVIP ? 'Yes' : 'No'}`);
      console.log(`   Features: ${pkg.features.join(', ')}`);
      console.log(`   Pricing by Car Size:`);
      console.log(`     - Small Cars: ${pkg.pricing.small} SAR`);
      console.log(`     - Medium Cars: ${pkg.pricing.medium} SAR`);
      console.log(`     - Large Cars: ${pkg.pricing.large} SAR`);
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