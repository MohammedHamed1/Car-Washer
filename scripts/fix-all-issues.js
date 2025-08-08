const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_CONFIG } = require('./database-config');

async function fixAllIssues() {
  try {
    console.log('🚀 Starting comprehensive project fix...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
    console.log('✅ Connected to MongoDB');
    
    // Import models
    const User = require('./modules/user/user.model');
    const Package = require('./modules/package/package.model');
    
    console.log('\n📋 Step 1: Fixing .env file...');
    console.log('⚠️ Please manually fix the .env file by removing the extra line at the end');
    
    console.log('\n📋 Step 2: Clearing all packages...');
    await Package.deleteMany({});
    console.log('✅ All packages deleted');
    
    console.log('\n📋 Step 3: Creating the 4 basic packages...');
    const packages = [
      {
        name: 'الباقة الأساسية',
        description: 'الخيار المثالي لمن يبحث عن نظافة أساسية مع توفير إضافي!',
        basePrice: 150,
        originalPrice: 235,
        savings: 85,
        features: [
          '4 غسلات باستخدام صابون إيطالي فاخر عالي الجودة',
          'غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم',
          'غسلة إضافية مجانية، ليصبح إجمالي الغسلات: 5',
          'إجمالي التوفير: 85 ريال سعودي'
        ],
        washes: 5,
        duration: 30,
        size: 'small',
        isVIP: false,
        status: 'active',
        pricing: {
          small: 150,
          medium: 200,
          large: 250
        }
      },
      {
        name: 'الباقة المتقدمة',
        description: 'الخيار العملي للنظافة المثالية بسعر تنافسي.',
        basePrice: 280,
        originalPrice: 420,
        savings: 140,
        features: [
          '8 غسلات باستخدام صابون إيطالي فاخر يمنح سيارتك العناية التي تستحقها',
          'غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم',
          'غسلتان مجانيتان، ليصبح إجمالي الغسلات: 10',
          'إجمالي التوفير: 140 ريال سعودي'
        ],
        washes: 10,
        duration: 30,
        size: 'small',
        isVIP: false,
        status: 'active',
        pricing: {
          small: 280,
          medium: 350,
          large: 420
        }
      },
      {
        name: 'الباقة الشاملة',
        description: 'الخيار الأمثل لمن يريد العناية القصوى بسياراته مع أكبر قدر من التوفير.',
        basePrice: 490,
        originalPrice: 770,
        savings: 280,
        features: [
          '14 غسلة باستخدام صابون إيطالي فاخر يوفر عناية فائقة بسيارتك',
          'غسيل بطبقتين من الصابون لضمان إزالة الأوساخ بفعالية وحماية طويلة الأمد',
          '4 غسلات مجانية، ليصبح إجمالي الغسلات: 18',
          'إجمالي التوفير: 280 ريال سعودي'
        ],
        washes: 18,
        duration: 30,
        size: 'small',
        isVIP: false,
        status: 'active',
        pricing: {
          small: 490,
          medium: 600,
          large: 720
        }
      },
      {
        name: 'باقة VIP',
        description: 'خدمة VIP متميزة للفنادق فقط - غسلة واحدة بسعر ثابت',
        basePrice: 150,
        originalPrice: 235,
        savings: 85,
        features: [
          'غسيل شامل تشمل الموقف والفالية',
          'خدمة VIP متميزة',
          'صالح في الفنادق المحددة فقط',
          'خدمة متميزة ضمان الجودة',
          '1 غسلة VIP'
        ],
        washes: 1,
        duration: 30,
        size: 'small',
        isVIP: true,
        status: 'active',
        pricing: {
          small: 150,
          medium: 150,
          large: 150
        }
      }
    ];
    
    await Package.insertMany(packages);
    console.log('✅ 4 basic packages created');
    
    console.log('\n📋 Step 4: Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = new User({
      name: 'مدير النظام',
      username: 'admin_paypass',
      email: 'admin@paypass.com',
      phone: '+966500000000',
      password: hashedPassword,
      role: 'admin',
      referralCode: 'ADMIN001',
      isActive: true,
      isVerified: true,
      status: 'active'
    });
    
    await adminUser.save();
    console.log('✅ Admin user created');
    
    console.log('\n📋 Step 5: Creating employee user...');
    const employeePassword = await bcrypt.hash('employee123', 12);
    
    const employeeUser = new User({
      name: 'موظف النظام',
      username: 'employee_paypass',
      email: 'employee@paypass.com',
      phone: '+966500000001',
      password: employeePassword,
      role: 'employee',
      referralCode: 'EMP001',
      isActive: true,
      isVerified: true,
      status: 'active'
    });
    
    await employeeUser.save();
    console.log('✅ Employee user created');
    
    console.log('\n📋 Step 6: Creating owner user...');
    const ownerPassword = await bcrypt.hash('owner123', 12);
    
    const ownerUser = new User({
      name: 'مالك النظام',
      username: 'owner_paypass',
      email: 'owner@paypass.com',
      phone: '+966500000002',
      password: ownerPassword,
      role: 'owner',
      referralCode: 'OWNER001',
      isActive: true,
      isVerified: true,
      status: 'active'
    });
    
    await ownerUser.save();
    console.log('✅ Owner user created');
    
    console.log('\n📋 Step 7: Verification...');
    const totalUsers = await User.countDocuments();
    const totalPackages = await Package.countDocuments();
    
    console.log(`✅ Total users: ${totalUsers}`);
    console.log(`✅ Total packages: ${totalPackages}`);
    
    console.log('\n🎉 All issues fixed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('==================================================');
    console.log('1. Admin: admin@paypass.com / admin123');
    console.log('2. Employee: employee@paypass.com / employee123');
    console.log('3. Owner: owner@paypass.com / owner123');
    console.log('==================================================');
    
    console.log('\n⚠️ IMPORTANT: Please fix the .env file manually!');
    console.log('Remove the extra line at the end of the file.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
}

fixAllIssues(); 