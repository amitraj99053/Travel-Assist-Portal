const Mechanic = require('../models/Mechanic');
const ServiceRequest = require('../models/ServiceRequest');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { successResponse, errorResponse } = require('../utils/response');

// Get mechanic profile
exports.getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone profilePicture');

    if (!mechanic) {
      return errorResponse(res, 404, 'Mechanic not found');
    }

    const reviews = await Review.find({ mechanicId: req.params.id })
      .limit(5)
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Mechanic profile fetched', {
      ...mechanic.toObject(),
      recentReviews: reviews,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch mechanic profile: ' + error.message);
  }
};

// Get mechanic dashboard
exports.getMechanicDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return errorResponse(res, 403, 'Forbidden: Not a mechanic');
    }

    const mechanic = await Mechanic.findOne({ userId: req.user._id });

    if (!mechanic) {
      return errorResponse(res, 404, 'Mechanic profile not found');
    }

    // Get today's jobs
    const todaysJobs = await Booking.find({
      mechanicId: mechanic._id,
      bookingDate: {
        $gte: new Date(new Date().toDateString()),
        $lt: new Date(new Date().toDateString()).setDate(new Date().getDate() + 1),
      },
    });

    // Get pending requests
    const pendingRequests = await ServiceRequest.find({
      mechanicId: mechanic._id,
      status: 'pending',
    });

    // Get recent reviews
    const recentReviews = await Review.find({ mechanicId: mechanic._id })
      .limit(5)
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Dashboard fetched', {
      mechanic: {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        isVerified: mechanic.isVerified,
        isAvailable: mechanic.isAvailable,
        skills: mechanic.skills,
        rating: mechanic.totalRating,
        reviews: mechanic.totalReviews,
        totalJobs: mechanic.totalJobs,
        totalEarnings: mechanic.totalEarnings,
      },
      todaysJobs: todaysJobs.length,
      pendingRequests: pendingRequests.length,
      recentReviews,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch dashboard: ' + error.message);
  }
};

// Update availability
exports.updateAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return errorResponse(res, 403, 'Forbidden: Not a mechanic');
    }

    const { isAvailable } = req.body;

    const mechanic = await Mechanic.findOneAndUpdate(
      { userId: req.user._id },
      { isAvailable, updatedAt: new Date() },
      { new: true }
    );

    successResponse(res, 200, 'Availability updated', {
      isAvailable: mechanic.isAvailable,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update availability: ' + error.message);
  }
};

// Accept service request
exports.acceptServiceRequest = async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return errorResponse(res, 403, 'Forbidden: Not a mechanic');
    }

    const { requestId } = req.params;
    const mechanic = await Mechanic.findOne({ userId: req.user._id });

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      {
        mechanicId: mechanic._id,
        status: 'accepted',
        acceptedAt: new Date(),
      },
      { new: true }
    );

    successResponse(res, 200, 'Service request accepted', {
      id: serviceRequest._id,
      status: serviceRequest.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to accept request: ' + error.message);
  }
};

// Get mechanic bookings
exports.getMechanicBookings = async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return errorResponse(res, 403, 'Forbidden: Not a mechanic');
    }

    const mechanic = await Mechanic.findOne({ userId: req.user._id });

    const bookings = await Booking.find({
      mechanicId: mechanic._id,
    })
      .populate('userId', 'firstName lastName phone profilePicture')
      .sort({ bookingDate: -1 });

    successResponse(res, 200, 'Bookings fetched', bookings);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch bookings: ' + error.message);
  }
};

// Complete booking
exports.completeBooking = async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return errorResponse(res, 403, 'Forbidden: Not a mechanic');
    }

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    booking.status = 'completed';
    await booking.save();

    // Update mechanic stats
    const mechanic = await Mechanic.findOneAndUpdate(
      { userId: req.user._id },
      {
        $inc: { totalJobs: 1, totalEarnings: booking.totalCost },
      },
      { new: true }
    );

    successResponse(res, 200, 'Booking completed', {
      status: booking.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to complete booking: ' + error.message);
  }
};
