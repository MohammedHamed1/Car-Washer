const mongoose = require('mongoose');

const washSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.Mixed, ref: 'Car' },
  washingPlace: { type: mongoose.Schema.Types.Mixed, ref: 'WashingPlace', required: true },
  package: { type: mongoose.Schema.Types.Mixed, ref: 'Package', required: true },
  owner: { type: mongoose.Schema.Types.Mixed, ref: 'User' }, // new field for owner who scanned
  washDate: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  tip: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Wash', washSchema); 