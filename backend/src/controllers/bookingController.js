const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');
const { successResponse, errorResponse } = require('../utils/response');
const { generateInvoiceNumber, generateTransactionId } = require('../utils/validators');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { mechanicId, serviceRequestId, bookingDate, duration, totalCost, serviceDescription, location } = req.body;

    if (!mechanicId || !bookingDate || !duration || !totalCost) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    const booking = await Booking.create({
      userId: req.user._id,
      mechanicId,
      serviceRequestId,
      bookingDate,
      duration,
      totalCost,
      serviceDescription,
      location,
      status: 'scheduled',
      paymentStatus: 'pending',
    });

    // Update service request status if exists
    if (serviceRequestId) {
      await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
        mechanicId,
        status: 'accepted',
        acceptedAt: new Date(),
      });
    }

    successResponse(res, 201, 'Booking created successfully', {
      id: booking._id,
      status: booking.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to create booking: ' + error.message);
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate('mechanicId', 'userId')
      .sort({ bookingDate: -1 });

    successResponse(res, 200, 'Bookings fetched', bookings);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch bookings: ' + error.message);
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    if (!bookingId || !paymentMethod || !amount) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to pay for this booking');
    }

    const invoiceNumber = generateInvoiceNumber();
    const transactionId = generateTransactionId();

    const payment = await Payment.create({
      bookingId,
      userId: req.user._id,
      mechanicId: booking.mechanicId,
      amount,
      tax: Math.round(amount * 0.05), // 5% tax
      totalAmount: amount + Math.round(amount * 0.05),
      paymentMethod,
      transactionId,
      invoiceNumber,
      status: 'completed', // In real scenario, integrate payment gateway
      completedAt: new Date(),
    });

    // Update booking payment status
    booking.paymentStatus = 'completed';
    await booking.save();

    successResponse(res, 201, 'Payment processed successfully', {
      id: payment._id,
      invoiceNumber: payment.invoiceNumber,
      transactionId: payment.transactionId,
      totalAmount: payment.totalAmount,
      status: payment.status,
    });
  } catch (error) {
    errorResponse(res, 500, 'Payment processing failed: ' + error.message);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return errorResponse(res, 404, 'Payment not found');
    }

    if (payment.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized');
    }

    successResponse(res, 200, 'Payment details fetched', payment);
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch payment: ' + error.message);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to cancel this booking');
    }

    if (booking.status !== 'scheduled') {
      return errorResponse(res, 400, 'Cannot cancel booking in current status');
    }

    booking.status = 'cancelled';
    await booking.save();

    // Refund payment if completed
    if (booking.paymentStatus === 'completed') {
      await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        { status: 'refunded' }
      );
    }

    successResponse(res, 200, 'Booking cancelled successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to cancel booking: ' + error.message);
  }
};
