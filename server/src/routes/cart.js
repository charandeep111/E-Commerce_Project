// src/routes/cart.js – Cart CRUD routes (customer protected)
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');

// All routes require an authenticated customer
router.use(protect, authorize('customer'));

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart); // Changed from DELETE to POST as per prompt
router.put('/update', updateCartItem);
router.delete('/clear', clearCart);

module.exports = router;
