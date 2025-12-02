const express = require('express');
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/message', authenticate, chatController.sendMessage);
router.get('/conversation/:userId', authenticate, chatController.getConversation);
router.get('/list', authenticate, chatController.getConversations);

module.exports = router;
