const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  size: { 
    type: String, 
    enum: ['small', 'medium', 'large'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  lastWashDate: { type: Date },
  totalWashes: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual field for size display name
carSchema.virtual('sizeDisplayName').get(function() {
  const sizeNames = {
    small: 'صغيرة',
    medium: 'متوسطة', 
    large: 'كبيرة'
  };
  return sizeNames[this.size] || this.size;
});

// Virtual field for size description
carSchema.virtual('sizeDescription').get(function() {
  const sizeDescriptions = {
    small: 'سيارات صغيرة مثل السيدان والهاتشباك',
    medium: 'سيارات متوسطة مثل SUV والكروس أوفر',
    large: 'سيارات كبيرة مثل الشاحنات والفانات'
  };
  return sizeDescriptions[this.size] || '';
});

// Method to get pricing info for this car size
carSchema.methods.getPricingInfo = function() {
  const pricing = {
    small: {
      name: 'صغيرة',
      description: 'سيارات صغيرة مثل السيدان والهاتشباك',
      examples: ['تويوتا كامري', 'هوندا سيفيك', 'نيسان سنترا']
    },
    medium: {
      name: 'متوسطة',
      description: 'سيارات متوسطة مثل SUV والكروس أوفر',
      examples: ['تويوتا راف 4', 'هوندا CR-V', 'نيسان روغ']
    },
    large: {
      name: 'كبيرة',
      description: 'سيارات كبيرة مثل الشاحنات والفانات',
      examples: ['تويوتا لاند كروزر', 'نيسان باترول', 'شيفروليه تاهو']
    }
  };
  return pricing[this.size] || null;
};

module.exports = mongoose.model('Car', carSchema); 