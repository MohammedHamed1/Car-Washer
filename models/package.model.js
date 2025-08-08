const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  // Basic Information
  _id: { type: String, required: true }, // Custom ID
  type: { type: String, enum: ['basic', 'advanced', 'premium', 'vip'], required: true },
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  description: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  
  // Pricing Information
  price: { type: Number, required: true }, // Base price for small car
  originalPrice: { type: Number, required: true },
  savings: { type: Number, required: true },
  
  // Wash Information
  washes: { type: Number, required: true },
  paidWashes: { type: Number, required: true },
  freeWashes: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  
  // Status and Flags
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true },
  isVIP: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isBestValue: { type: Boolean, default: false },
  
  // UI Information
  icon: { type: String, required: true },
  color: { type: String, required: true },
  sortOrder: { type: Number, default: 1 },
  
  // Target Audience
  recommendedFor: { type: String, required: true },
  recommendedForEn: { type: String, required: true },
  
  // Features
  features: [{ type: String }],
  featuresEn: [{ type: String }],
  
  // Car Size Pricing (Legacy support)
  size: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  basePrice: { type: Number, required: true }, // Legacy field
  
  // New Pricing Structure
  carPrices: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  carPricesOriginal: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  carPricesSavings: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  
  // Legacy Pricing (for backward compatibility)
  pricing: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  
  // Metadata
  createdBy: { type: String, default: 'admin' }
}, { 
  timestamps: true,
  _id: false, // Allow custom _id
  strict: false // Allow additional fields
});

// Method to get price based on car size
packageSchema.methods.getPriceBySize = function(carSize) {
  return this.carPrices[carSize] || this.pricing[carSize] || this.price;
};

// Method to get savings based on car size
packageSchema.methods.getSavingsBySize = function(carSize) {
  const originalPrice = this.carPricesOriginal[carSize] || this.originalPrice;
  const currentPrice = this.getPriceBySize(carSize);
  return originalPrice - currentPrice;
};

// Method to get total savings
packageSchema.methods.getTotalSavings = function() {
  return this.savings;
};

// Method to get package summary
packageSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    price: this.price,
    savings: this.savings,
    washes: this.washes,
    isPopular: this.isPopular,
    isBestValue: this.isBestValue,
    isVIP: this.isVIP
  };
};

module.exports = mongoose.model('Package', packageSchema); 