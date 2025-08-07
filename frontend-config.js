// Frontend Configuration for PayPass
const FRONTEND_CONFIG = {
  // Frontend URLs
  local: 'http://localhost:5175',
  development: 'http://localhost:5174',
  admin: 'http://localhost:3001',
  
  // Backend URLs
  backend: {
    local: 'https://car-washer-production.up.railway.app',
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
      'http://localhost:3001',
      'https://car-washer-production.up.railway.app'
    ],
    credentials: true
  }
};

module.exports = FRONTEND_CONFIG; 