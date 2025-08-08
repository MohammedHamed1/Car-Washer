// Standard Response Handler Middleware
const { API_CONFIG } = require('../config/api');

// Success response helper
const successResponse = (res, data = {}, message = 'Operation completed successfully', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Error response helper
const errorResponse = (res, error = 'An error occurred', statusCode = 500, details = {}) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Validation error response
const validationError = (res, errors) => {
  return res.status(API_CONFIG.statusCodes.BAD_REQUEST).json({
    success: false,
    error: 'Validation failed',
    details: errors,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Not found response
const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(API_CONFIG.statusCodes.NOT_FOUND).json({
    success: false,
    error: `${resource} not found`,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Unauthorized response
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(API_CONFIG.statusCodes.UNAUTHORIZED).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Forbidden response
const forbiddenResponse = (res, message = 'Access forbidden') => {
  return res.status(API_CONFIG.statusCodes.FORBIDDEN).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Conflict response
const conflictResponse = (res, message = 'Resource conflict') => {
  return res.status(API_CONFIG.statusCodes.CONFLICT).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version
  });
};

// Middleware to add response helpers to res object
const responseHandler = (req, res, next) => {
  // Add response helpers to res object
  res.success = (data, message, statusCode) => successResponse(res, data, message, statusCode);
  res.error = (error, statusCode, details) => errorResponse(res, error, statusCode, details);
  res.validationError = (errors) => validationError(res, errors);
  res.notFound = (resource) => notFoundResponse(res, resource);
  res.unauthorized = (message) => unauthorizedResponse(res, message);
  res.forbidden = (message) => forbiddenResponse(res, message);
  res.conflict = (message) => conflictResponse(res, message);
  
  next();
};

module.exports = {
  responseHandler,
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse
};
