const mongoose = require('mongoose');

const SOSSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
  },
  emergencyType: {
    type: String,
    enum: ['breakdown', 'accident', 'health', 'threat', 'other'],
    required: true,
  },
  description: String,
  contacts: [
    {
      name: String,
      phone: String,
      email: String,
    },
  ],
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active',
  },
  liveLocationLink: String,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  respondedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SOSSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS', SOSSchema);
