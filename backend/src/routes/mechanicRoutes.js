const express = require('express');
const mechanicController = require('../controllers/mechanicController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/profile/:id', authenticate, mechanicController.getMechanicProfile);
router.get('/dashboard', authenticate, authorize(['mechanic']), mechanicController.getMechanicDashboard);
router.put('/availability', authenticate, authorize(['mechanic']), mechanicController.updateAvailability);
router.put('/request/:requestId/accept', authenticate, authorize(['mechanic']), mechanicController.acceptServiceRequest);
router.get('/bookings', authenticate, authorize(['mechanic']), mechanicController.getMechanicBookings);
router.put('/booking/:bookingId/complete', authenticate, authorize(['mechanic']), mechanicController.completeBooking);
router.put('/booking/:bookingId/status', authenticate, authorize(['mechanic']), mechanicController.updateBookingStatus);

module.exports = router;
