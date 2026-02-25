const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, wishlistController.addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, wishlistController.removeFromWishlist);

// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, wishlistController.getWishlist);

module.exports = router;
