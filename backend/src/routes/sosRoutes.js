const express = require('express');
const sosController = require('../controllers/sosController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, sosController.createSOS);
router.get('/my-alerts', authenticate, sosController.getUserSOSAlerts);
router.get('/nearby', authenticate, sosController.getNearbySOSAlerts);
router.put('/:sosId/resolve', authenticate, sosController.resolveSOSAlert);

module.exports = router;
