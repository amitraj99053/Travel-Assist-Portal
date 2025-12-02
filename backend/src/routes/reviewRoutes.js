const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, reviewController.submitReview);
router.get('/mechanic/:mechanicId', authenticate, reviewController.getMechanicReviews);
router.get('/user/my-reviews', authenticate, reviewController.getUserReviews);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;
