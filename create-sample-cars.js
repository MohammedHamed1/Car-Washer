const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('./database-config');

async function createSampleCars() {
  try {
    console.log('🚗 Creating Sample Cars (Size Only)...');
    
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection;
    
    // Clear existing cars
    console.log('🧹 Clearing existing cars...');
    const carsCollection = db.db.collection('cars');
    await carsCollection.deleteMany({});
    console.log('✅ Existing cars cleared');
    
    // Sample cars data (size only)
    const sampleCars = [
      {
        size: 'small',
        isActive: true,
        totalWashes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        size: 'medium',
        isActive: true,
        totalWashes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        size: 'large',
        isActive: true,
        totalWashes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await carsCollection.insertMany(sampleCars);
    console.log('✅ Sample cars created!');
    
    console.log('\n🚗 SAMPLE CARS CREATED (SIZE ONLY):');
    console.log('='.repeat(50));
    
    const sizeNames = {
      small: 'صغيرة',
      medium: 'متوسطة',
      large: 'كبيرة'
    };
    
    sampleCars.forEach((car, index) => {
      console.log(`${index + 1}. سيارة ${sizeNames[car.size]}`);
      console.log(`   الحجم: ${car.size} (${sizeNames[car.size]})`);
      console.log(`   نشطة: ${car.isActive ? 'نعم' : 'لا'}`);
      console.log(`   عدد الغسلات: ${car.totalWashes}`);
      console.log('');
    });
    
    console.log('📊 ملخص الأحجام:');
    console.log('='.repeat(50));
    console.log('🚗 صغيرة (small): سيارات صغيرة مثل السيدان والهاتشباك');
    console.log('🚙 متوسطة (medium): سيارات متوسطة مثل SUV والكروس أوفر');
    console.log('🚐 كبيرة (large): سيارات كبيرة مثل الشاحنات والفانات');
    console.log('');
    
    console.log('💰 الأسعار حسب الحجم:');
    console.log('='.repeat(50));
    console.log('📦 الباقة الأساسية:');
    console.log('   - صغيرة: 150 ريال');
    console.log('   - متوسطة: 200 ريال');
    console.log('   - كبيرة: 250 ريال');
    console.log('');
    console.log('📦 الباقة المتقدمة:');
    console.log('   - صغيرة: 280 ريال');
    console.log('   - متوسطة: 350 ريال');
    console.log('   - كبيرة: 420 ريال');
    console.log('');
    console.log('📦 الباقة الشاملة:');
    console.log('   - صغيرة: 490 ريال');
    console.log('   - متوسطة: 600 ريال');
    console.log('   - كبيرة: 770 ريال');
    console.log('');
    console.log('👑 باقة VIP (في الفنادق فقط):');
    console.log('   - جميع الأحجام: 150 ريال ثابت');
    console.log('');
    
    console.log('🎉 تم إنشاء السيارات التجريبية بنجاح!');
    
  } catch (error) {
    console.error('❌ Error creating sample cars:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

// Run the function
if (require.main === module) {
  createSampleCars();
}

module.exports = { createSampleCars }; 