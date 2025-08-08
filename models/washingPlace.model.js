const mongoose = require('mongoose');

const washingPlaceSchema = new mongoose.Schema({
  // Basic Information
  _id: { type: String, required: true }, // Custom ID
  name: { type: String, required: true },
  nameEn: { type: String, required: true },
  
  // Location Information
  location: {
    address: { type: String, required: true },
    addressEn: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    googleMapsUrl: { type: String },
    area: { type: String, required: true },
    areaEn: { type: String, required: true },
    city: { type: String, required: true },
    cityEn: { type: String, required: true },
    postalCode: { type: String }
  },
  
  // Contact Information
  contact: {
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String },
    website: { type: String }
  },
  
  // Services Information
  services: {
    carWash: { type: Boolean, default: true },
    vipService: { type: Boolean, default: false },
    detailing: { type: Boolean, default: true },
    polishing: { type: Boolean, default: true },
    waxing: { type: Boolean, default: true },
    interiorCleaning: { type: Boolean, default: true },
    engineCleaning: { type: Boolean, default: false },
    valetWash: { type: Boolean, default: false },
    conciergeService: { type: Boolean, default: false }
  },
  
  // Operating Hours
  operatingHours: {
    sunday: {
      open: { type: String, default: "07:00" },
      close: { type: String, default: "22:00" },
      isOpen: { type: Boolean, default: true }
    },
    monday: {
      open: { type: String, default: "07:00" },
      close: { type: String, default: "22:00" },
      isOpen: { type: Boolean, default: true }
    },
    tuesday: {
      open: { type: String, default: "07:00" },
      close: { type: String, default: "22:00" },
      isOpen: { type: Boolean, default: true }
    },
    wednesday: {
      open: { type: String, default: "07:00" },
      close: { type: String, default: "22:00" },
      isOpen: { type: Boolean, default: true }
    },
    thursday: {
      open: { type: String, default: "07:00" },
      close: { type: String, default: "22:00" },
      isOpen: { type: Boolean, default: true }
    },
    friday: {
      open: { type: String, default: "08:00" },
      close: { type: String, default: "23:00" },
      isOpen: { type: Boolean, default: true }
    },
    saturday: {
      open: { type: String, default: "08:00" },
      close: { type: String, default: "23:00" },
      isOpen: { type: Boolean, default: true }
    }
  },
  
  // Features
  features: [{ type: String }],
  featuresEn: [{ type: String }],
  
  // Status and Type
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true },
  isMainBranch: { type: Boolean, default: false },
  isVipEnabled: { type: Boolean, default: false },
  isVipOnly: { type: Boolean, default: false },
  isHotelBranch: { type: Boolean, default: false },
  
  // Hotel Information (for VIP hotels)
  hotelInfo: {
    hotelName: { type: String },
    hotelNameEn: { type: String },
    hotelRating: { type: Number, min: 1, max: 5 },
    hotelType: { type: String },
    hotelTypeEn: { type: String },
    vipServiceAvailable: { type: Boolean, default: false },
    valetService: { type: Boolean, default: false },
    parkingService: { type: Boolean, default: false }
  },
  
  // VIP Package Information
  vipPackage: {
    packageId: { type: String },
    packageName: { type: String },
    packageNameEn: { type: String },
    price: { type: Number },
    originalPrice: { type: Number },
    savings: { type: Number },
    washes: { type: Number },
    description: { type: String }
  },
  
  // Capacity and Ratings
  capacity: {
    dailyCapacity: { type: Number, default: 100 },
    currentLoad: { type: Number, default: 0 },
    estimatedWaitTime: { type: Number, default: 15 }
  },
  
  ratings: {
    averageRating: { type: Number, min: 0, max: 5, default: 4.5 },
    totalReviews: { type: Number, default: 0 },
    fiveStarReviews: { type: Number, default: 0 },
    fourStarReviews: { type: Number, default: 0 },
    threeStarReviews: { type: Number, default: 0 },
    twoStarReviews: { type: Number, default: 0 },
    oneStarReviews: { type: Number, default: 0 }
  },
  
  // Additional Information
  customers: { type: String },
  images: {
    main: { type: String },
    exterior: { type: String },
    interior: { type: String },
    equipment: { type: String },
    valet: { type: String }
  },
  
  // Metadata
  createdBy: { type: String, default: 'admin' },
  sortOrder: { type: Number, default: 1 }
  
}, { 
  timestamps: true,
  _id: false, // Allow custom _id
  strict: false // Allow additional fields
});

// Virtual for feedbacks
washingPlaceSchema.virtual('feedbacks', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'washingPlace',
});

// Method to get location summary
washingPlaceSchema.methods.getLocationSummary = function() {
  return {
    name: this.name,
    address: this.location.address,
    coordinates: this.location.coordinates,
    area: this.location.area,
    city: this.location.city
  };
};

// Method to get services summary
washingPlaceSchema.methods.getServicesSummary = function() {
  return {
    carWash: this.services.carWash,
    vipService: this.services.vipService,
    detailing: this.services.detailing,
    polishing: this.services.polishing,
    waxing: this.services.waxing,
    interiorCleaning: this.services.interiorCleaning,
    engineCleaning: this.services.engineCleaning
  };
};

// Method to check if open
washingPlaceSchema.methods.isOpenNow = function() {
  const now = new Date();
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const todayHours = this.operatingHours[dayOfWeek];
  
  if (!todayHours.isOpen) return false;
  
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(todayHours.open.replace(':', ''));
  const closeTime = parseInt(todayHours.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
};

washingPlaceSchema.set('toObject', { virtuals: true });
washingPlaceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('WashingPlace', washingPlaceSchema); 