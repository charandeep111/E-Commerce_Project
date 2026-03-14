// src/routes/order.js – Order routes (checkout, vendor view, admin view)
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    createOrder,
    getUserOrders,
    getVendorOrders,
    getAllOrders,
} = require('../controllers/orderController');

// Create order
router.post('/create', protect, createOrder);

// Get user orders
router.get('/user', protect, getUserOrders);

// Vendor can view own orders
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);

// Admin can view all orders
router.get('/admin', protect, authorize('admin'), getAllOrders);

module.exports = router;
