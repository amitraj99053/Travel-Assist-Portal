const ServiceRequest = require('../models/ServiceRequest');
const Mechanic = require('../models/Mechanic');
const { successResponse, errorResponse } = require('../utils/response');
const { getDistance } = require('../utils/apis');

// Create service request
exports.createServiceRequest = async (req, res) => {
  try {
    const { title, description, issueType, vehicleInfo, location, priority } = req.body;

    if (!title || !description || !issueType || !location) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    const serviceRequest = await ServiceRequest.create({
      userId: req.user._id,
      title,
      description,
      issueType,
      vehicleInfo,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      priority: priority || 'medium',
      status: 'pending',
    });

    // Notify mechanics about the new request
    const io = req.app.get('io');
    // In a real app, we would filter by location here or let the client filter
    // For now, broadcast to all mechanics
    const populatedRequest = await ServiceRequest.findById(serviceRequest._id).populate('userId', 'firstName lastName phone profilePicture');

    io.to('mechanics').emit('new-request', populatedRequest);

    successResponse(res, 201, 'Service request created successfully', {
      id: serviceRequest._id,
      title: serviceRequest.title,
      status: serviceRequest.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to create service request: ' + error.message);
  }
};

// Get nearby mechanics
exports.getNearbyMechanics = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10, skillRequired } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 400, 'Please provide latitude and longitude');
    }

    // Find mechanics within radius
    const mechanics = await Mechanic.find({
      isVerified: true,
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistance * 1000, // Convert km to meters
        },
      },
    }).populate('userId', 'firstName lastName profilePicture phone');

    // Filter by skill if required
    let filtered = mechanics;
    if (skillRequired) {
      filtered = mechanics.filter((m) => m.skills.includes(skillRequired));
    }

    // Calculate distance for each mechanic
    const mechanicsWithDistance = await Promise.all(
      filtered.map(async (mechanic) => ({
        id: mechanic._id,
        name: mechanic.userId.firstName + ' ' + mechanic.userId.lastName,
        profilePicture: mechanic.userId.profilePicture,
        phone: mechanic.userId.phone,
        skills: mechanic.skills,
        rating: mechanic.totalRating,
        reviews: mechanic.totalReviews,
        experience: mechanic.yearsOfExperience,
        shopName: mechanic.shopName,
      }))
    );

    successResponse(res, 200, 'Nearby mechanics found', mechanicsWithDistance);
  } catch (error) {
    errorResponse(res, 500, 'Failed to find mechanics: ' + error.message);
  }
};

// Get service requests by user
exports.getUserServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({
      userId: req.user._id,
    })
      .populate('mechanicId', 'userId')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Service requests fetched', serviceRequests);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch service requests: ' + error.message);
  }
};

// Get service request by ID
exports.getServiceRequestById = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate(
      'mechanicId',
      'userId'
    );

    if (!serviceRequest) {
      return errorResponse(res, 404, 'Service request not found');
    }

    successResponse(res, 200, 'Service request fetched', serviceRequest);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch service request: ' + error.message);
  }
};

// Cancel service request
exports.cancelServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return errorResponse(res, 404, 'Service request not found');
    }

    if (serviceRequest.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to cancel this request');
    }

    if (serviceRequest.status !== 'pending') {
      return errorResponse(res, 400, 'Cannot cancel request in current status');
    }

    serviceRequest.status = 'cancelled';
    await serviceRequest.save();

    successResponse(res, 200, 'Service request cancelled');
  } catch (error) {
    errorResponse(res, 500, 'Failed to cancel request: ' + error.message);
  }
};

// Get nearby service requests (for mechanics)
exports.getNearbyServiceRequests = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10 } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 400, 'Please provide latitude and longitude');
    }

    // Find pending requests within radius that are not assigned to any mechanic
    const requests = await ServiceRequest.find({
      status: 'pending',
      $or: [{ mechanicId: { $exists: false } }, { mechanicId: null }],
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistance * 1000, // Convert km to meters
        },
      },
    }).populate('userId', 'firstName lastName phone profilePicture');

    successResponse(res, 200, 'Nearby service requests found', requests);
  } catch (error) {
    errorResponse(res, 500, 'Failed to find service requests: ' + error.message);
  }
};
