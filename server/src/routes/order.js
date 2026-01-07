// src/routes/order.js – Order routes (checkout, vendor view, admin view)
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    checkout,
    getMyOrders,
    getVendorOrders,
    getAllOrders,
} = require('../controllers/orderController');

// Checkout – customer only
router.post('/checkout', protect, authorize('customer'), checkout);
router.get('/myorders', protect, authorize('customer'), getMyOrders);

// Vendor can view own orders
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);

// Admin can view all orders
router.get('/admin', protect, authorize('admin'), getAllOrders);

module.exports = router;
