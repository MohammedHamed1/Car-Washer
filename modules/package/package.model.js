const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true }, // السعر الأساسي للسيارة الصغيرة
  originalPrice: { type: Number, required: true },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
  washes: { type: Number, required: true },
  savings: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  size: { type: String, enum: ['small', 'medium', 'large'], required: true }, // required car size for this package
  isVIP: { type: Boolean, default: false }, // هل الباقة VIP للفنادق فقط
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  
  // أسعار مختلفة حسب حجم السيارة
  pricing: {
    small: { type: Number, required: true }, // السعر للسيارات الصغيرة
    medium: { type: Number, required: true }, // السعر للسيارات المتوسطة
    large: { type: Number, required: true }   // السعر للسيارات الكبيرة
  }
}, { timestamps: true });

// Method to get price based on car size
packageSchema.methods.getPriceBySize = function(carSize) {
  return this.pricing[carSize] || this.basePrice;
};

// Method to get savings based on car size
packageSchema.methods.getSavingsBySize = function(carSize) {
  const originalPrice = this.originalPrice;
  const currentPrice = this.getPriceBySize(carSize);
  return originalPrice - currentPrice;
};

module.exports = mongoose.model('Package', packageSchema); 