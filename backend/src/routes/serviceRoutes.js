const express = require('express');
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, serviceController.createServiceRequest);
router.get('/nearby-mechanics', authenticate, serviceController.getNearbyMechanics);
router.get('/my-requests', authenticate, serviceController.getUserServiceRequests);
router.get('/:id', authenticate, serviceController.getServiceRequestById);
router.put('/:id/cancel', authenticate, serviceController.cancelServiceRequest);

module.exports = router;
