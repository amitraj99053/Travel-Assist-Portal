const express = require('express');
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/my-bookings', authenticate, bookingController.getUserBookings);
router.post('/payment', authenticate, bookingController.processPayment);
router.get('/payment/:id', authenticate, bookingController.getPaymentDetails);
router.get('/:id', authenticate, bookingController.getBookingById);
router.delete('/:id', authenticate, bookingController.cancelBooking);

module.exports = router;
