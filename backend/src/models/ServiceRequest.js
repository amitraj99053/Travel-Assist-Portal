const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic',
  },
  title: {
    type: String,
    required: [true, 'Please provide service title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
  },
  issueType: {
    type: String,
    enum: ['breakdown', 'accident', 'maintenance', 'repair', 'emergency'],
    required: true,
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    registrationNumber: String,
    color: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
  },
  estimatedCost: Number,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'on-the-way', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  serviceImages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
