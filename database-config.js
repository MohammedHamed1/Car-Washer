// Database Configuration - Auto Connect
const MONGODB_CONFIG = {
  uri: process.env.MONGODB_URI || "mongodb+srv://CarWasherDB:Password%40%23%24123456789@dartabases.aqbbmr9.mongodb.net/CarWasherDB?retryWrites=true&w=majority&appName=DartaBases",
  options: {
    // Modern MongoDB connection options
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000, // Increased timeout
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000, // Added connect timeout
    // Connection retry settings
    retryWrites: true,
    retryReads: true,
    // Auto index creation
    autoIndex: true,
    // Buffer settings - Allow buffering for initial connection
    bufferCommands: true, // Changed to true
    // Authentication
    authSource: 'admin'
  }
};

// Server Configuration
const SERVER_CONFIG = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'paypass_jwt_secret_key_2024_secure'
};

module.exports = {
  MONGODB_CONFIG,
  SERVER_CONFIG
}; 