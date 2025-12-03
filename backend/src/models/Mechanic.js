const mongoose = require('mongoose');

const MechanicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide license number'],
    unique: true,
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'Please provide license expiry date'],
  },
  skills: {
    type: [String],
    enum: ['engine', 'transmission', 'electrical', 'brake', 'suspension', 'tire', 'general'],
    required: true,
  },
  certifications: [String],
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  shopName: String,
  shopAddress: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalJobs: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  serviceRadius: {
    type: Number,
    default: 10, // in km
  },
  bankAccount: {
    holderName: String,
    accountNumber: String,
    ifscCode: String,
  },
  documents: {
    licenseFile: String,
    certificationFile: String,
    identityFile: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index for location-based queries
MechanicSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Mechanic', MechanicSchema);
