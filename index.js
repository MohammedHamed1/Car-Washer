require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { responseHandler } = require('./middleware/responseHandler');
const FRONTEND_CONFIG = require('./frontend-config');

// تحميل جميع النماذج قبل الاتصال بقاعدة البيانات
// Core models (load first)
require('./models/user.model');
require('./models/car.model');
require('./models/washingPlace.model');
require('./models/package.model');

// Dependent models (load after core models)
require('./models/userPackage.model');
require('./models/wash.model');
require('./models/payment.model');
require('./models/feedback.model');
require('./models/notification.model');
require('./models/referral.model');

const app = express();

// اتصال قاعدة البيانات
connectDB();

// CORS configuration for frontend
app.use(cors({
  origin: FRONTEND_CONFIG.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add response handler middleware
app.use(responseHandler);

// نقطة الجذر
app.get('/', (req, res) => {
  res.success({
    message: 'Welcome to PayPass Backend API! 🚀',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      docs: '/api/docs',
      test: '/api/test',
      health: '/api/health',
      users: '/api/users',
      cars: '/api/cars',
      packages: '/api/packages',
      payments: '/api/payments',
      washes: '/api/washes',
      washingPlaces: '/api/washing-places',
      feedbacks: '/api/feedbacks',
      referrals: '/api/referrals',
      auth: '/api/auth'
    }
  }, 'API is running successfully');
});

// استخدام المسارات
app.use('/api', routes);

// معالج الأخطاء
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
}); 