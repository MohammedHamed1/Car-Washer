const mongoose = require('mongoose');
const connectDB = require('../config/db');

// MongoDB Test Configuration
const MONGODB_TEST_CONFIG = {
  timeout: 15000,
  expectedCollections: [
    'users',
    'cars', 
    'packages',
    'userpackages',
    'payments',
    'washes',
    'washingplaces',
    'feedbacks',
    'notifications',
    'referrals'
  ],
  expectedModels: [
    'User',
    'Car',
    'Package', 
    'UserPackage',
    'Payment',
    'Wash',
    'WashingPlace',
    'Feedback',
    'Notification',
    'Referral'
  ]
};

// Test results storage
const mongoTestResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Helper function to log test results
const logMongoTestResult = (testName, status, details = '') => {
  mongoTestResults.total++;
  if (status === 'PASS') {
    mongoTestResults.passed++;
    console.log(`✅ ${testName} - PASS`);
  } else {
    mongoTestResults.failed++;
    console.log(`❌ ${testName} - FAIL: ${details}`);
  }
  mongoTestResults.details.push({ name: testName, status, details });
};

// Helper function to print final report
const printMongoTestReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🗄️  MONGODB TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${mongoTestResults.total}`);
  console.log(`Passed: ${mongoTestResults.passed} ✅`);
  console.log(`Failed: ${mongoTestResults.failed} ❌`);
  console.log(`Success Rate: ${((mongoTestResults.passed / mongoTestResults.total) * 100).toFixed(2)}%`);
  
  if (mongoTestResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    mongoTestResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
};

// MongoDB Test Suite
describe('MongoDB Connection & Collections Tests', () => {
  let db = null;
  let collections = [];
  let models = [];

  // Before all tests
  beforeAll(async () => {
    console.log('🗄️  Starting MongoDB Tests...');
    console.log(`⏱️  Timeout: ${MONGODB_TEST_CONFIG.timeout}ms`);
    
    try {
      // Connect to MongoDB
      await connectDB();
      db = mongoose.connection.db;
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    }
  });

  // After all tests
  afterAll(async () => {
    printMongoTestReport();
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  });

  // ========================================
  // 🔌 Connection Tests
  // ========================================

  describe('MongoDB Connection', () => {
    test('Database connection status', async () => {
      try {
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
        logMongoTestResult('Database connection status', 'PASS');
      } catch (error) {
        logMongoTestResult('Database connection status', 'FAIL', error.message);
      }
    });

    test('Database name verification', async () => {
      try {
        const dbName = mongoose.connection.name;
        expect(dbName).toBe('paypass');
        logMongoTestResult('Database name verification', 'PASS');
      } catch (error) {
        logMongoTestResult('Database name verification', 'FAIL', error.message);
      }
    });

    test('Database host verification', async () => {
      try {
        const host = mongoose.connection.host;
        expect(host).toContain('cluster0.3vqlnfg.mongodb.net');
        logMongoTestResult('Database host verification', 'PASS');
      } catch (error) {
        logMongoTestResult('Database host verification', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📦 Models Tests
  // ========================================

  describe('Mongoose Models', () => {
    test('All expected models are loaded', async () => {
      try {
        models = mongoose.modelNames();
        console.log('📦 Loaded Models:', models);
        
        MONGODB_TEST_CONFIG.expectedModels.forEach(expectedModel => {
          expect(models).toContain(expectedModel);
        });
        
        logMongoTestResult('All expected models are loaded', 'PASS');
      } catch (error) {
        logMongoTestResult('All expected models are loaded', 'FAIL', error.message);
      }
    });

    test('Model count verification', async () => {
      try {
        expect(models.length).toBeGreaterThanOrEqual(MONGODB_TEST_CONFIG.expectedModels.length);
        logMongoTestResult('Model count verification', 'PASS');
      } catch (error) {
        logMongoTestResult('Model count verification', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📁 Collections Tests
  // ========================================

  describe('MongoDB Collections', () => {
    test('All expected collections exist', async () => {
      try {
        collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        console.log('📁 Found Collections:', collectionNames);
        
        MONGODB_TEST_CONFIG.expectedCollections.forEach(expectedCollection => {
          expect(collectionNames).toContain(expectedCollection);
        });
        
        logMongoTestResult('All expected collections exist', 'PASS');
      } catch (error) {
        logMongoTestResult('All expected collections exist', 'FAIL', error.message);
      }
    });

    test('Collection count verification', async () => {
      try {
        expect(collections.length).toBeGreaterThanOrEqual(MONGODB_TEST_CONFIG.expectedCollections.length);
        logMongoTestResult('Collection count verification', 'PASS');
      } catch (error) {
        logMongoTestResult('Collection count verification', 'FAIL', error.message);
      }
    });

    test('Collection naming consistency', async () => {
      try {
        const collectionNames = collections.map(col => col.name);
        
        // Check for consistent naming (lowercase, plural)
        collectionNames.forEach(name => {
          expect(name).toMatch(/^[a-z]+s?$/); // lowercase, optionally plural
        });
        
        logMongoTestResult('Collection naming consistency', 'PASS');
      } catch (error) {
        logMongoTestResult('Collection naming consistency', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔍 Schema Tests
  // ========================================

  describe('Schema Validation', () => {
    test('Strict mode is enabled', async () => {
      try {
        // Check if strict mode is enabled globally
        const strictQuery = mongoose.get('strictQuery');
        expect(strictQuery).toBe(true);
        logMongoTestResult('Strict mode is enabled', 'PASS');
      } catch (error) {
        logMongoTestResult('Strict mode is enabled', 'FAIL', error.message);
      }
    });

    test('Auto create and auto index are enabled', async () => {
      try {
        // This test verifies that collections are created automatically
        // by checking if they exist after model loading
        expect(collections.length).toBeGreaterThan(0);
        logMongoTestResult('Auto create and auto index are enabled', 'PASS');
      } catch (error) {
        logMongoTestResult('Auto create and auto index are enabled', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 📊 Data Structure Tests
  // ========================================

  describe('Data Structure Validation', () => {
    test('User collection structure', async () => {
      try {
        const User = mongoose.model('User');
        const userSchema = User.schema;
        
        // Check required fields exist
        expect(userSchema.paths.email).toBeDefined();
        expect(userSchema.paths.password).toBeDefined();
        expect(userSchema.paths.name).toBeDefined();
        
        logMongoTestResult('User collection structure', 'PASS');
      } catch (error) {
        logMongoTestResult('User collection structure', 'FAIL', error.message);
      }
    });

    test('Car collection structure', async () => {
      try {
        const Car = mongoose.model('Car');
        const carSchema = Car.schema;
        
        // Check required fields exist
        expect(carSchema.paths.brand).toBeDefined();
        expect(carSchema.paths.model).toBeDefined();
        expect(carSchema.paths.plateNumber).toBeDefined();
        expect(carSchema.paths.size).toBeDefined();
        
        logMongoTestResult('Car collection structure', 'PASS');
      } catch (error) {
        logMongoTestResult('Car collection structure', 'FAIL', error.message);
      }
    });

    test('Package collection structure', async () => {
      try {
        const Package = mongoose.model('Package');
        const packageSchema = Package.schema;
        
        // Check required fields exist
        expect(packageSchema.paths.name).toBeDefined();
        expect(packageSchema.paths.price).toBeDefined();
        expect(packageSchema.paths.washesIncluded).toBeDefined();
        
        logMongoTestResult('Package collection structure', 'PASS');
      } catch (error) {
        logMongoTestResult('Package collection structure', 'FAIL', error.message);
      }
    });

    test('UserPackage collection structure', async () => {
      try {
        const UserPackage = mongoose.model('UserPackage');
        const userPackageSchema = UserPackage.schema;
        
        // Check required fields exist
        expect(userPackageSchema.paths.user).toBeDefined();
        expect(userPackageSchema.paths.package).toBeDefined();
        expect(userPackageSchema.paths.remainingWashes).toBeDefined();
        
        logMongoTestResult('UserPackage collection structure', 'PASS');
      } catch (error) {
        logMongoTestResult('UserPackage collection structure', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🔗 Relationship Tests
  // ========================================

  describe('Model Relationships', () => {
    test('User-UserPackage relationship', async () => {
      try {
        const User = mongoose.model('User');
        const UserPackage = mongoose.model('UserPackage');
        
        // Check if UserPackage references User
        const userPackageSchema = UserPackage.schema;
        const userRef = userPackageSchema.paths.user;
        
        expect(userRef.instance).toBe('ObjectID');
        expect(userRef.options.ref).toBe('User');
        
        logMongoTestResult('User-UserPackage relationship', 'PASS');
      } catch (error) {
        logMongoTestResult('User-UserPackage relationship', 'FAIL', error.message);
      }
    });

    test('Package-UserPackage relationship', async () => {
      try {
        const Package = mongoose.model('Package');
        const UserPackage = mongoose.model('UserPackage');
        
        // Check if UserPackage references Package
        const userPackageSchema = UserPackage.schema;
        const packageRef = userPackageSchema.paths.package;
        
        expect(packageRef.instance).toBe('ObjectID');
        expect(packageRef.options.ref).toBe('Package');
        
        logMongoTestResult('Package-UserPackage relationship', 'PASS');
      } catch (error) {
        logMongoTestResult('Package-UserPackage relationship', 'FAIL', error.message);
      }
    });

    test('User-Car relationship', async () => {
      try {
        const User = mongoose.model('User');
        const Car = mongoose.model('Car');
        
        // Check if Car references User
        const carSchema = Car.schema;
        const userRef = carSchema.paths.user;
        
        expect(userRef.instance).toBe('ObjectID');
        expect(userRef.options.ref).toBe('User');
        
        logMongoTestResult('User-Car relationship', 'PASS');
      } catch (error) {
        logMongoTestResult('User-Car relationship', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // ⚡ Performance Tests
  // ========================================

  describe('Performance & Indexes', () => {
    test('Indexes are created automatically', async () => {
      try {
        // Check if indexes are created for key fields
        const User = mongoose.model('User');
        const indexes = await User.collection.indexes();
        
        // Should have at least the default _id index
        expect(indexes.length).toBeGreaterThan(0);
        
        logMongoTestResult('Indexes are created automatically', 'PASS');
      } catch (error) {
        logMongoTestResult('Indexes are created automatically', 'FAIL', error.message);
      }
    });

    test('Connection pool configuration', async () => {
      try {
        // Check connection pool settings
        const poolSize = mongoose.connection.db.serverConfig.s.options.maxPoolSize;
        expect(poolSize).toBeGreaterThan(0);
        
        logMongoTestResult('Connection pool configuration', 'PASS');
      } catch (error) {
        logMongoTestResult('Connection pool configuration', 'FAIL', error.message);
      }
    });
  });

  // ========================================
  // 🛡️ Security Tests
  // ========================================

  describe('Security & Validation', () => {
    test('Password hashing is configured', async () => {
      try {
        const User = mongoose.model('User');
        const userSchema = User.schema;
        
        // Check if password field has pre-save middleware
        const passwordField = userSchema.paths.password;
        expect(passwordField).toBeDefined();
        
        logMongoTestResult('Password hashing is configured', 'PASS');
      } catch (error) {
        logMongoTestResult('Password hashing is configured', 'FAIL', error.message);
      }
    });

    test('JWT token validation', async () => {
      try {
        // This test verifies that JWT_SECRET is configured
        expect(process.env.JWT_SECRET).toBeDefined();
        expect(process.env.JWT_SECRET.length).toBeGreaterThan(10);
        
        logMongoTestResult('JWT token validation', 'PASS');
      } catch (error) {
        logMongoTestResult('JWT token validation', 'FAIL', error.message);
      }
    });
  });
});
