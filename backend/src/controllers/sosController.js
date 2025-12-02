const SOS = require('../models/SOS');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

// Create SOS alert
exports.createSOS = async (req, res) => {
  try {
    const { location, emergencyType, description, contacts } = req.body;

    if (!location || !emergencyType) {
      return errorResponse(res, 400, 'Please provide location and emergency type');
    }

    const liveLocationLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;

    const sos = await SOS.create({
      userId: req.user._id,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      emergencyType,
      description,
      contacts,
      status: 'active',
      liveLocationLink,
    });

    successResponse(res, 201, 'SOS alert created', {
      id: sos._id,
      liveLocationLink: sos.liveLocationLink,
      status: sos.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to create SOS: ' + error.message);
  }
};

// Get user SOS alerts
exports.getUserSOSAlerts = async (req, res) => {
  try {
    const sosAlerts = await SOS.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'SOS alerts fetched', sosAlerts);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch SOS alerts: ' + error.message);
  }
};

// Resolve SOS
exports.resolveSOSAlert = async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.sosId);

    if (!sos) {
      return errorResponse(res, 404, 'SOS alert not found');
    }

    if (sos.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to resolve this SOS');
    }

    sos.status = 'resolved';
    sos.respondedAt = new Date();
    sos.respondedBy = req.user._id;
    await sos.save();

    successResponse(res, 200, 'SOS resolved', {
      status: sos.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to resolve SOS: ' + error.message);
  }
};

// Get nearby SOS alerts (for emergency responders)
exports.getNearbySOSAlerts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 400, 'Please provide latitude and longitude');
    }

    const sosAlerts = await SOS.find({
      status: 'active',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000,
        },
      },
    })
      .populate('userId', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Nearby SOS alerts found', sosAlerts);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch SOS alerts: ' + error.message);
  }
};
