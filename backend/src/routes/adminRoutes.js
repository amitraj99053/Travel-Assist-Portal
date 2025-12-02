const express = require('express');
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/dashboard', authenticate, authorize(['admin']), adminController.getAdminDashboard);
router.get('/users', authenticate, authorize(['admin']), adminController.getAllUsers);
router.get('/mechanics/pending', authenticate, authorize(['admin']), adminController.getPendingMechanics);
router.put('/mechanic/:mechanicId/verify', authenticate, authorize(['admin']), adminController.verifyMechanic);
router.put('/mechanic/:mechanicId/reject', authenticate, authorize(['admin']), adminController.rejectMechanic);
router.put('/user/:userId/toggle-block', authenticate, authorize(['admin']), adminController.toggleUserBlock);

module.exports = router;
