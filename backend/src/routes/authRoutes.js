const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/register-mechanic', authController.registerMechanic);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
