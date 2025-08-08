const mongoose = require('mongoose');

// تفعيل الوضع الصارم لمنع أي حقول غير معرفة في الـ schema
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://elhadad3593:NIqGTCLDJJFOFbtf@cluster0.3vqlnfg.mongodb.net/paypass?retryWrites=true&w=majority", {
      autoCreate: true, // ينشئ الجداول (collections) تلقائيًا
      autoIndex: true,  // ينشئ الفهارس تلقائيًا
      maxPoolSize: 50, // زيادة حجم الـ pool للاختبارات المتزامنة
      minPoolSize: 5, // إضافة minimum pool size
      serverSelectionTimeoutMS: 10000, // زيادة timeout للاتصال
      socketTimeoutMS: 60000, // زيادة socket timeout
      connectTimeoutMS: 10000, // إضافة connection timeout
      retryWrites: true,
      retryReads: true,
      bufferCommands: false, // تحسين الأداء
      bufferMaxEntries: 0, // تحسين الأداء
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database: paypass');
    console.log('🌐 Host: cluster0.3vqlnfg.mongodb.net');

    // التحقق من تحميل جميع النماذج
    const models = mongoose.modelNames();
    console.log(`📦 Models Loaded: ${models.join(', ')}`);

    // اختبار الاتصال
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🔍 Please check:');
    console.error('   1. Internet connection');
    console.error('   2. MongoDB Atlas Network Access (IP whitelist)');
    console.error('   3. Database credentials');
    process.exit(1);
  }
};

// إعداد مراقبة الاتصال
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB connection disconnected');
});

module.exports = connectDB; 