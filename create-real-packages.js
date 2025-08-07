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
          small: 150,   // السعر للسيارات الصغيرة
          medium: 200,  // السعر للسيارات المتوسطة
          large: 250    // السعر للسيارات الكبيرة
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
          small: 280,   // السعر للسيارات الصغيرة
          medium: 350,  // السعر للسيارات المتوسطة
          large: 420    // السعر للسيارات الكبيرة
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
          small: 490,   // السعر للسيارات الصغيرة
          medium: 600,  // السعر للسيارات المتوسطة
          large: 770    // السعر للسيارات الكبيرة
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
    
    console.log('\n📦 REAL PACKAGES CREATED:');
    console.log('='.repeat(50));
    console.log(`Total Packages: ${packages.length}`);
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
    
    console.log('🎉 Real packages created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating real packages:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

createRealPackages(); 