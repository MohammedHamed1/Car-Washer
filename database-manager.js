const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const User = require('./modules/user/user.model');
const Package = require('./modules/package/package.model');
const WashingPlace = require('./modules/washingPlace/washingPlace.model');
const Car = require('./modules/car/car.model');
const Wash = require('./modules/wash/wash.model');
const Payment = require('./modules/payment/payment.model');
const Feedback = require('./modules/feedback/feedback.model');
const UserPackage = require('./modules/package/userPackage.model');

class DatabaseManager {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize database with all required data
  async initializeDatabase() {
    try {
      console.log('🚀 Initializing database with all required data...');
      
      // Check if database is already initialized
      const packagesCount = await Package.countDocuments();
      const usersCount = await User.countDocuments();
      const washingPlacesCount = await WashingPlace.countDocuments();
      
      if (packagesCount > 0 && usersCount > 0 && washingPlacesCount > 0) {
        console.log('✅ Database already initialized');
        this.isInitialized = true;
        return { success: true, message: 'Database already initialized' };
      }

      // Initialize all data
      await this.createPackages();
      await this.createUsers();
      await this.createWashingPlaces();
      await this.createSampleData();
      
      this.isInitialized = true;
      console.log('✅ Database initialization completed successfully');
      
      return { 
        success: true, 
        message: 'Database initialized successfully',
        data: {
          packages: await Package.countDocuments(),
          users: await User.countDocuments(),
          washingPlaces: await WashingPlace.countDocuments(),
          cars: await Car.countDocuments(),
          washes: await Wash.countDocuments(),
          payments: await Payment.countDocuments(),
          feedbacks: await Feedback.countDocuments(),
          userPackages: await UserPackage.countDocuments()
        }
      };
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Create all packages
  async createPackages() {
    try {
      console.log('📦 Creating packages...');
      await Package.deleteMany({});
      
      const packages = [
        {
          _id: "basic_package_001",
          type: "basic",
          name: "الباقة الأساسية",
          nameEn: "Basic Package",
          description: "مناسبة للاستخدام العادي - 5 غسلات بجودة عالية",
          descriptionEn: "Suitable for regular use - 5 high-quality washes",
          price: 150,
          originalPrice: 235,
          savings: 85,
          washes: 5,
          paidWashes: 4,
          freeWashes: 1,
          duration: 30,
          status: "active",
          icon: "Shield",
          color: "green",
          isPopular: false,
          isBestValue: false,
          isVip: false,
          recommendedFor: "للأفراد العاديين",
          recommendedForEn: "For regular individuals",
          features: [
            "4 غسلات باستخدام صابون إيطالي فاخر عالي الجودة",
            "غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم",
            "غسلة إضافية مجانية، ليصبح إجمالي الغسلات: 5",
            "إجمالي التوفير: 85 ريال سعودي",
            "مدة الصلاحية: 30 يوم من تاريخ الشراء"
          ],
          featuresEn: [
            "4 washes using premium Italian soap",
            "Two-layer washing for deep cleaning and lasting shine",
            "1 free wash, total washes: 5",
            "Total savings: 85 SAR",
            "Validity period: 30 days from purchase date"
          ],
          carPrices: { small: 150, medium: 200, large: 250 },
          carPricesOriginal: { small: 235, medium: 285, large: 335 },
          carPricesSavings: { small: 85, medium: 85, large: 85 },
          pricing: { small: 150, medium: 200, large: 250 },
          basePrice: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 1
        },
        {
          _id: "advanced_package_002",
          type: "advanced",
          name: "الباقة المتقدمة",
          nameEn: "Advanced Package",
          description: "مناسبة للاستخدام المتوسط - 10 غسلات بجودة فائقة",
          descriptionEn: "Suitable for moderate use - 10 premium quality washes",
          price: 280,
          originalPrice: 420,
          savings: 140,
          washes: 10,
          paidWashes: 8,
          freeWashes: 2,
          duration: 30,
          status: "active",
          icon: "Zap",
          color: "blue",
          isPopular: true,
          isBestValue: false,
          isVip: false,
          recommendedFor: "للأسر المتوسطة",
          recommendedForEn: "For medium families",
          features: [
            "8 غسلات باستخدام صابون إيطالي فاخر يمنح سيارتك العناية التي تستحقها",
            "غسيل بطبقتين من الصابون لضمان نظافة عميقة ولمعان يدوم",
            "غسلتان مجانيتان، ليصبح إجمالي الغسلات: 10",
            "إجمالي التوفير: 140 ريال سعودي",
            "مدة الصلاحية: 30 يوم من تاريخ الشراء"
          ],
          featuresEn: [
            "8 washes using premium Italian soap for your car's deserved care",
            "Two-layer washing for deep cleaning and lasting shine",
            "2 free washes, total washes: 10",
            "Total savings: 140 SAR",
            "Validity period: 30 days from purchase date"
          ],
          carPrices: { small: 280, medium: 350, large: 420 },
          carPricesOriginal: { small: 420, medium: 490, large: 560 },
          carPricesSavings: { small: 140, medium: 140, large: 140 },
          pricing: { small: 280, medium: 350, large: 420 },
          basePrice: 280,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 2
        },
        {
          _id: "premium_package_003",
          type: "premium",
          name: "الباقة الشاملة",
          nameEn: "Premium Package",
          description: "مناسبة للاستخدام المكثف - 18 غسلة بجودة استثنائية",
          descriptionEn: "Suitable for intensive use - 18 exceptional quality washes",
          price: 490,
          originalPrice: 770,
          savings: 280,
          washes: 18,
          paidWashes: 14,
          freeWashes: 4,
          duration: 30,
          status: "active",
          icon: "Star",
          color: "purple",
          isPopular: false,
          isBestValue: true,
          isVip: false,
          recommendedFor: "للمستخدمين المكثفين",
          recommendedForEn: "For intensive users",
          features: [
            "14 غسلة باستخدام صابون إيطالي فاخر يوفر عناية فائقة بسيارتك",
            "غسيل بطبقتين من الصابون لضمان إزالة الأوساخ بفعالية وحماية طويلة الأمد",
            "4 غسلات مجانية، ليصبح إجمالي الغسلات: 18",
            "إجمالي التوفير: 280 ريال سعودي",
            "مدة الصلاحية: 30 يوم من تاريخ الشراء"
          ],
          featuresEn: [
            "14 washes using premium Italian soap for exceptional car care",
            "Two-layer washing for effective dirt removal and long-term protection",
            "4 free washes, total washes: 18",
            "Total savings: 280 SAR",
            "Validity period: 30 days from purchase date"
          ],
          carPrices: { small: 490, medium: 600, large: 720 },
          carPricesOriginal: { small: 770, medium: 880, large: 1000 },
          carPricesSavings: { small: 280, medium: 280, large: 280 },
          pricing: { small: 490, medium: 600, large: 720 },
          basePrice: 490,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 3
        },
        {
          _id: "vip_package_004",
          type: "vip",
          name: "باقة VIP",
          nameEn: "VIP Package",
          description: "مخصصة للفنادق فقط - خدمة VIP متميزة",
          descriptionEn: "Exclusive for hotels only - Premium VIP service",
          price: 150,
          originalPrice: 235,
          savings: 85,
          washes: 1,
          paidWashes: 1,
          freeWashes: 0,
          duration: 30,
          status: "active",
          icon: "Crown",
          color: "gold",
          isPopular: false,
          isBestValue: false,
          isVip: true,
          recommendedFor: "للفنادق والضيافة",
          recommendedForEn: "For hotels and hospitality",
          features: [
            "1 غسلة VIP فقط",
            "غسيل شامل تشمل الموقف والفالية",
            "خدمة VIP متميزة",
            "صالح في الفنادق المحددة فقط",
            "خدمة متميزة ضمان الجودة",
            "إجمالي التوفير: 85 ريال سعودي"
          ],
          featuresEn: [
            "1 VIP wash only",
            "Comprehensive washing including parking and valet",
            "Premium VIP service",
            "Valid in designated hotels only",
            "Premium service with quality guarantee",
            "Total savings: 85 SAR"
          ],
          carPrices: { small: 150, medium: 150, large: 150 },
          carPricesOriginal: { small: 235, medium: 235, large: 235 },
          carPricesSavings: { small: 85, medium: 85, large: 85 },
          pricing: { small: 150, medium: 150, large: 150 },
          basePrice: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 4
        }
      ];

      await Package.insertMany(packages);
      console.log(`✅ Created ${packages.length} packages`);
      
    } catch (error) {
      console.error('❌ Error creating packages:', error);
      throw error;
    }
  }

  // Create users
  async createUsers() {
    try {
      console.log('👥 Creating users...');
      await User.deleteMany({});
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const users = [
        {
          name: "مدير النظام",
          username: "admin",
          email: "admin@paypass.com",
          password: hashedPassword,
          phone: "+966-50-123-4567",
          role: "admin",
          isActive: true,
          isVerified: true,
          status: "active",
          referralCode: "ADMIN001",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "موظف النظام",
          username: "employee",
          email: "employee@paypass.com",
          password: hashedPassword,
          phone: "+966-50-123-4568",
          role: "employee",
          isActive: true,
          isVerified: true,
          status: "active",
          referralCode: "EMP001",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "مالك النظام",
          username: "owner",
          email: "owner@paypass.com",
          password: hashedPassword,
          phone: "+966-50-123-4569",
          role: "owner",
          isActive: true,
          isVerified: true,
          status: "active",
          referralCode: "OWNER001",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "مستخدم عادي",
          username: "user",
          email: "user@paypass.com",
          password: hashedPassword,
          phone: "+966-50-123-4570",
          role: "user",
          isActive: true,
          isVerified: true,
          status: "active",
          referralCode: "USER001",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await User.insertMany(users);
      console.log(`✅ Created ${users.length} users`);
      
    } catch (error) {
      console.error('❌ Error creating users:', error);
      throw error;
    }
  }

  // Create washing places
  async createWashingPlaces() {
    try {
      console.log('🏢 Creating washing places...');
      await WashingPlace.deleteMany({});
      
      const washingPlaces = [
        // Regular branches
        {
          _id: "branch_001",
          name: "فرع الرياض - النخيل",
          nameEn: "Riyadh Branch - Al Nakheel",
          location: {
            address: "شارع الملك فهد، حي النخيل، الرياض",
            addressEn: "King Fahd Road, Al Nakheel District, Riyadh",
            coordinates: { latitude: 24.7136, longitude: 46.6753 },
            googleMapsUrl: "https://maps.google.com/?q=24.7136,46.6753",
            area: "النخيل",
            areaEn: "Al Nakheel",
            city: "الرياض",
            cityEn: "Riyadh",
            postalCode: "12345"
          },
          contact: {
            phone: "+966-11-123-4567",
            whatsapp: "+966-50-123-4567",
            email: "nakheel@carwash.com",
            website: "https://carwash.com"
          },
          services: {
            carWash: true,
            vipService: true,
            detailing: true,
            polishing: true,
            waxing: true,
            interiorCleaning: true,
            engineCleaning: false,
            valetWash: false,
            conciergeService: false
          },
          operatingHours: {
            sunday: { open: "07:00", close: "22:00", isOpen: true },
            monday: { open: "07:00", close: "22:00", isOpen: true },
            tuesday: { open: "07:00", close: "22:00", isOpen: true },
            wednesday: { open: "07:00", close: "22:00", isOpen: true },
            thursday: { open: "07:00", close: "22:00", isOpen: true },
            friday: { open: "08:00", close: "23:00", isOpen: true },
            saturday: { open: "08:00", close: "23:00", isOpen: true }
          },
          features: [
            "خدمة غسيل سريعة",
            "صابون إيطالي فاخر",
            "خدمة VIP متميزة",
            "موقف سيارات مجاني",
            "غرفة انتظار مكيفة",
            "خدمة عملاء 24/7"
          ],
          featuresEn: [
            "Fast washing service",
            "Premium Italian soap",
            "VIP service",
            "Free parking",
            "Air-conditioned waiting room",
            "24/7 customer service"
          ],
          status: "active",
          isMainBranch: true,
          isVipEnabled: true,
          isVipOnly: false,
          isHotelBranch: false,
          capacity: {
            dailyCapacity: 100,
            currentLoad: 0,
            estimatedWaitTime: 15
          },
          ratings: {
            averageRating: 4.8,
            totalReviews: 156,
            fiveStarReviews: 120,
            fourStarReviews: 25,
            threeStarReviews: 8,
            twoStarReviews: 2,
            oneStarReviews: 1
          },
          images: {
            main: "/images/branches/nakheel-main.jpg",
            exterior: "/images/branches/nakheel-exterior.jpg",
            interior: "/images/branches/nakheel-interior.jpg",
            equipment: "/images/branches/nakheel-equipment.jpg"
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 1
        },
        // VIP Hotels
        {
          _id: "vip_hotel_001",
          name: "فندق هيلتون الرياض",
          nameEn: "Hilton Riyadh Hotel",
          location: {
            address: "شارع الملك فهد، حي العليا، الرياض",
            addressEn: "King Fahd Road, Al Olaya District, Riyadh",
            coordinates: { latitude: 24.7136, longitude: 46.6753 },
            googleMapsUrl: "https://maps.app.goo.gl/hD3KYnFEgx9pEXBu6?g_st=iw",
            area: "العليا",
            areaEn: "Al Olaya",
            city: "الرياض",
            cityEn: "Riyadh",
            postalCode: "12345"
          },
          contact: {
            phone: "+966 11 488 1234",
            whatsapp: "+966-50-123-4567",
            email: "hilton@carwash.com",
            website: "https://carwash.com"
          },
          hotelInfo: {
            hotelName: "هيلتون الرياض",
            hotelNameEn: "Hilton Riyadh",
            hotelRating: 5,
            hotelType: "فندق فاخر",
            hotelTypeEn: "Luxury Hotel",
            vipServiceAvailable: true,
            valetService: true,
            parkingService: true
          },
          services: {
            carWash: true,
            vipService: true,
            detailing: true,
            polishing: true,
            waxing: true,
            interiorCleaning: true,
            engineCleaning: false,
            valetWash: true,
            conciergeService: true
          },
          operatingHours: {
            sunday: { open: "07:00", close: "22:00", isOpen: true },
            monday: { open: "07:00", close: "22:00", isOpen: true },
            tuesday: { open: "07:00", close: "22:00", isOpen: true },
            wednesday: { open: "07:00", close: "22:00", isOpen: true },
            thursday: { open: "07:00", close: "22:00", isOpen: true },
            friday: { open: "08:00", close: "23:00", isOpen: true },
            saturday: { open: "08:00", close: "23:00", isOpen: true }
          },
          features: [
            "خدمة VIP حصرية",
            "غسيل شامل مع الفالية",
            "تلميع احترافي",
            "خدمة الكونسيرج",
            "موقف سيارات فاخر",
            "غرفة انتظار VIP"
          ],
          featuresEn: [
            "Exclusive VIP service",
            "Comprehensive washing with valet",
            "Professional polishing",
            "Concierge service",
            "Luxury parking",
            "VIP waiting room"
          ],
          vipPackage: {
            packageId: "vip_package_004",
            packageName: "باقة VIP",
            packageNameEn: "VIP Package",
            price: 150,
            originalPrice: 235,
            savings: 85,
            washes: 1,
            description: "خدمة VIP حصرية للفنادق"
          },
          status: "active",
          isVipOnly: true,
          isHotelBranch: true,
          isVipEnabled: true,
          isMainBranch: false,
          capacity: {
            dailyCapacity: 50,
            currentLoad: 0,
            estimatedWaitTime: 30
          },
          ratings: {
            averageRating: 4.9,
            totalReviews: 89,
            fiveStarReviews: 75,
            fourStarReviews: 12,
            threeStarReviews: 2,
            twoStarReviews: 0,
            oneStarReviews: 0
          },
          customers: "+500 عميل VIP",
          images: {
            main: "/images/vip-hotels/hilton-main.jpg",
            exterior: "/images/vip-hotels/hilton-exterior.jpg",
            interior: "/images/vip-hotels/hilton-interior.jpg",
            valet: "/images/vip-hotels/hilton-valet.jpg"
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "admin",
          isActive: true,
          sortOrder: 2
        }
      ];

      await WashingPlace.insertMany(washingPlaces);
      console.log(`✅ Created ${washingPlaces.length} washing places`);
      
    } catch (error) {
      console.error('❌ Error creating washing places:', error);
      throw error;
    }
  }

  // Create sample data
  async createSampleData() {
    try {
      console.log('📊 Creating sample data...');
      
             // Get admin user for reference
       const adminUser = await User.findOne({ email: "admin@paypass.com" });
       if (!adminUser) {
         console.log('⚠️ Admin user not found, skipping sample data');
         return;
       }
       
       // Create sample cars
       const sampleCars = [
         {
           user: adminUser._id,
           size: "medium",
           isActive: true,
           lastWashDate: new Date(),
           totalWashes: 5,
           createdAt: new Date(),
           updatedAt: new Date()
         }
       ];
      
      await Car.deleteMany({});
      await Car.insertMany(sampleCars);
      console.log(`✅ Created ${sampleCars.length} sample cars`);
      
             // Get references for sample washes
       const sampleCar = await Car.findOne({ user: adminUser._id });
       const basicPackage = await Package.findOne({ type: "basic" });
       const mainBranch = await WashingPlace.findOne({ isMainBranch: true });
       
       if (!sampleCar || !basicPackage || !mainBranch) {
         console.log('⚠️ Required data not found for sample washes');
         return;
       }
       
       // Create sample washes
       const sampleWashes = [
         {
           user: adminUser._id,
           washingPlace: mainBranch._id,
           package: basicPackage._id,
           car: sampleCar._id,
           status: "completed",
           washDate: new Date(),
           price: 150,
           createdAt: new Date(),
           updatedAt: new Date()
         }
       ];
      
      await Wash.deleteMany({});
      await Wash.insertMany(sampleWashes);
      console.log(`✅ Created ${sampleWashes.length} sample washes`);
      
    } catch (error) {
      console.error('❌ Error creating sample data:', error);
      throw error;
    }
  }

  // Get database status
  async getDatabaseStatus() {
    try {
      const status = {
        packages: await Package.countDocuments(),
        users: await User.countDocuments(),
        washingPlaces: await WashingPlace.countDocuments(),
        cars: await Car.countDocuments(),
        washes: await Wash.countDocuments(),
        payments: await Payment.countDocuments(),
        feedbacks: await Feedback.countDocuments(),
        userPackages: await UserPackage.countDocuments(),
        isInitialized: this.isInitialized,
        timestamp: new Date().toISOString()
      };
      
      return { success: true, data: status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset database
  async resetDatabase() {
    try {
      console.log('🔄 Resetting database...');
      
      await Package.deleteMany({});
      await User.deleteMany({});
      await WashingPlace.deleteMany({});
      await Car.deleteMany({});
      await Wash.deleteMany({});
      await Payment.deleteMany({});
      await Feedback.deleteMany({});
      await UserPackage.deleteMany({});
      
      this.isInitialized = false;
      console.log('✅ Database reset completed');
      
      return { success: true, message: 'Database reset completed' };
    } catch (error) {
      console.error('❌ Error resetting database:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = DatabaseManager; 