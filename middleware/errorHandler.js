// معالج الأخطاء الموحد للتطبيق
module.exports = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  console.error(`📍 URL: ${req.method} ${req.originalUrl}`);
  console.error(`📅 Timestamp: ${new Date().toISOString()}`);
  
  // تحديد نوع الخطأ
  let statusCode = err.status || 500;
  let message = err.message || 'Server Error';
  
  // معالجة أخطاء Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }
  
  // معالجة أخطاء Cast Error (ObjectId غير صحيح)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  // معالجة أخطاء Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  // معالجة أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
