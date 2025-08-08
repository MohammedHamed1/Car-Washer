// API Configuration
const API_CONFIG = {
  // Base URL for API
  baseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
  
  // API Version
  version: '2.0.0',
  
  // Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      me: '/auth/me',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    
    // Users
    users: {
      register: '/users/register',
      login: '/users/login',
      profile: '/users/profile',
      barcodes: '/users/barcodes',
      referralLink: '/users/referral-link',
      acceptReferral: '/users/accept-referral',
      rewardReferral: '/users/reward-referral',
      sendOtp: '/users/send-otp',
      verifyOtp: '/users/verify-otp',
      referralStatus: '/users/referral-status',
      phoneLoginInitiate: '/users/phone-login-initiate',
      phoneLoginVerify: '/users/phone-login-verify',
      phoneSignupInitiate: '/users/phone-signup-initiate',
      phoneSignupVerify: '/users/phone-signup-verify'
    },
    
    // Cars
    cars: {
      create: '/cars',
      getAll: '/cars',
      getById: '/cars/:id',
      update: '/cars/:id',
      delete: '/cars/:id',
      sizes: '/cars/sizes/available'
    },
    
    // Packages
    packages: {
      create: '/packages',
      getAll: '/packages',
      getById: '/packages/:id',
      update: '/packages/:id',
      delete: '/packages/:id',
      scanInfo: '/packages/scan-info',
      scanQr: '/packages/scan-qr',
      startWash: '/packages/start-wash'
    },
    
    // User Packages
    userPackages: {
      getAll: '/user-packages',
      getActive: '/user-packages/active',
      getStats: '/user-packages/stats',
      getById: '/user-packages/:id',
      update: '/user-packages/:id',
      useWash: '/user-packages/:id/use-wash',
      buy: '/user-packages/buy',
      create: '/user-packages',
      getByUserId: '/user-packages/by-user/:userId',
      test: '/user-packages/test/:id',
      debug: '/user-packages/debug/user-info'
    },
    
    // Payments
    payments: {
      create: '/payments',
      getAll: '/payments',
      getById: '/payments/:id',
      update: '/payments/:id',
      delete: '/payments/:id',
      hyperpayCheckout: '/payments/hyperpay-checkout',
      createFromHyperpay: '/payments/create-from-hyperpay',
      createTipFromHyperpay: '/payments/create-tip-from-hyperpay',
      testResult: '/payments/test-result',
      result: '/payments/result'
    },
    
    // Washes
    washes: {
      create: '/washes',
      getAll: '/washes',
      getByOwner: '/washes/by-owner',
      getById: '/washes/:id',
      update: '/washes/:id',
      delete: '/washes/:id',
      scanBarcode: '/washes/scan-barcode'
    },
    
    // Washing Places
    washingPlaces: {
      create: '/washing-places',
      getAll: '/washing-places',
      getNearest: '/washing-places/nearest',
      getById: '/washing-places/:id',
      update: '/washing-places/:id',
      delete: '/washing-places/:id',
      getFeedbacks: '/washing-places/:id/feedbacks'
    },
    
    // Feedbacks
    feedbacks: {
      create: '/feedbacks',
      getAll: '/feedbacks',
      getById: '/feedbacks/:id',
      update: '/feedbacks/:id',
      delete: '/feedbacks/:id',
      getByWashingPlace: '/feedbacks/washingPlace/:washingPlaceId',
      createForWash: '/feedbacks/for-wash'
    },
    
    // Referrals
    referrals: {
      getAll: '/referrals',
      getById: '/referrals/:id',
      create: '/referrals',
      accept: '/referrals/:id/accept',
      reward: '/referrals/:id/reward',
      delete: '/referrals/:id'
    },
    
    // QR Code
    qr: {
      generate: '/qr/generate',
      scan: '/qr/scan',
      validate: '/qr/validate'
    },
    
    // Dashboard
    dashboard: {
      stats: '/dashboard/stats',
      recentOrders: '/dashboard/recent-orders'
    },
    
    // System
    system: {
      docs: '/docs',
      test: '/test',
      health: '/health',
      root: '/'
    }
  },
  
  // HTTP Methods
  methods: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  },
  
  // Response Status Codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // Response Format
  responseFormat: {
    success: {
      success: true,
      message: 'Operation completed successfully',
      data: {}
    },
    error: {
      success: false,
      error: 'Error message',
      details: {}
    }
  },
  
  // Authentication
  auth: {
    type: 'Bearer Token',
    header: 'Authorization',
    format: 'Bearer <token>'
  }
};

// Helper function to build full URL
const buildUrl = (endpoint) => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Helper function to replace URL parameters
const replaceParams = (url, params) => {
  let result = url;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};

module.exports = {
  API_CONFIG,
  buildUrl,
  replaceParams
};
