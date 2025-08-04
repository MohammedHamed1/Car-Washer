// Frontend Configuration for PayPass
const FRONTEND_CONFIG = {
  // Frontend URLs
  local: 'http://localhost:5175',
  development: 'http://localhost:5174',
  production: 'https://paypasss.com',
  
  // Backend URLs
  backend: {
    local: 'http://localhost:5000',
    production: 'https://https-paypasss-com-six.vercel.app',
    api: {
      base: '/api',
      test: '/api/test',
      health: '/api/health',
      users: '/api/users',
      cars: '/api/cars',
      packages: '/api/packages',
      payments: '/api/payments'
    }
  },
  
  // CORS Settings
  cors: {
    origin: [
      'http://localhost:5175',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://paypasss.com',
      'https://https-paypasss-com-six.vercel.app'
    ],
    credentials: true
  }
};

module.exports = FRONTEND_CONFIG; 