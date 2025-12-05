const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Mechanic = require('../models/Mechanic');
const ServiceRequest = require('../models/ServiceRequest');
const { successResponse, errorResponse } = require('../utils/response');

// Submit review
exports.submitReview = async (req, res) => {
  try {
    const { mechanicId, bookingId, rating, title, comment } = req.body;

    if (!mechanicId || !bookingId || !rating || !title || !comment) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, 400, 'Rating must be between 1 and 5');
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to review this booking');
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return errorResponse(res, 400, 'Review already submitted for this booking');
    }

    const review = await Review.create({
      userId: req.user._id,
      mechanicId,
      bookingId,
      rating,
      title,
      comment,
      verified: true,
    });

    // Update mechanic rating
    const allReviews = await Review.find({ mechanicId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Mechanic.findByIdAndUpdate(
      mechanicId,
      {
        totalRating: Math.round(totalRating * 10) / 10,
        totalReviews: allReviews.length,
      }
    );

    // Update Service Request status to completed
    if (booking.serviceRequestId) {
      await ServiceRequest.findByIdAndUpdate(booking.serviceRequestId, {
        status: 'completed',
        completedAt: new Date(),
      });
    }

    successResponse(res, 201, 'Review submitted successfully', {
      id: review._id,
      rating: review.rating,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to submit review: ' + error.message);
  }
};

// Get mechanic reviews
exports.getMechanicReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ mechanicId: req.params.mechanicId })
      .populate('userId', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ mechanicId: req.params.mechanicId });

    successResponse(res, 200, 'Reviews fetched', {
      reviews,
      pagination: {
        total: totalReviews,
        page: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch reviews: ' + error.message);
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('mechanicId', 'userId')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Your reviews fetched', reviews);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch reviews: ' + error.message);
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to delete this review');
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Update mechanic rating
    const allReviews = await Review.find({ mechanicId: review.mechanicId });
    const totalRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await Mechanic.findByIdAndUpdate(
      review.mechanicId,
      {
        totalRating: Math.round(totalRating * 10) / 10,
        totalReviews: allReviews.length,
      }
    );

    successResponse(res, 200, 'Review deleted successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to delete review: ' + error.message);
  }
};
