const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { addReview, getProductReviews } = require('../controllers/reviewController');

router.post('/', protect, authorize('customer'), addReview);
router.get('/:productId', getProductReviews);

module.exports = router;
